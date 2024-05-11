import React, { lazy, useContext, useEffect, useState } from 'react'
import ConsumerAPI from '../api/consumer.api'
import { Form } from 'antd'
import ModalContext from "../contexts/modal.context"
import { TITLE, MESSAGE } from '../messages/main.message'
import { NotificationComponent } from '../components/common/notification.component'

const PageTitle = lazy(() => import("../components/common/pageTitle.component"))
const TableToolBar = lazy(() => import("../components/common/tableToolBar.component"))
const Table = lazy(() => import("../components/common/table.component"))
const EditButton = lazy(() => import("../components/common/editButton.component"))
const ConsumerForm = lazy(() => import("../components/consumer-management/consumerForm.component"))
const ModalCreateConsumer = lazy(() => import("../components/consumer-management/modalCreateConsumer.component"))
const ModalEditConsumer = lazy(() => import("../components/consumer-management/modalEditConsumer.component"))

const columns = [
  {
    title: "Tên khách hàng",
    dataIndex: "consumerName",
    key: "consumerName",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Email (nếu có)",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "Công nợ",
    dataIndex: "debt",
    key: "debt",
    sorter: (a, b) => a.quantity - b.quantity,
  },
  {
    title: "Chỉnh sửa",
    key: "edit",  
    render: (record) => <EditButton record={record} />,
  },
]

const data = [
  {
    key: "1",
    consumerName: "Consumer 1",
    address: "Address 1",
    phone: "Phone 1",
    email: "Email 1",
    debt: 100,
  },
  {
    key: "2",
    consumerName: "Consumer 2",
    address: "Address 2",
    phone: "Phone 2",
    email: "Email 2",
    debt: 200,
  },
  {
    key: "3",
    consumerName: "Consumer 3",
    address: "Address 3",
    phone: "Phone 3",
    email: "Email 3",
    debt: 300,
  },
]

export default function ConsumerPage () {
  const [filterTable, setFilterTable] = useState(null);
  const [form] = Form.useForm();
  const {
    isModalCreateOpen,
    isModalEditOpen,
    showModal,
    closeModal,
    selectedRecord,
  } = useContext(ModalContext);

  useEffect(() => {
    form.setFieldsValue(selectedRecord);
  }, [form, selectedRecord]);

  const handleOk = (variant) => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        console.log("🚀 ~ .then ~ values:", values);
        // TODO: send form values to server

        form.resetFields();
        NotificationComponent('success', TITLE.SUCCESS, variant === "create" ? MESSAGE.CREATE_SUCCESS : MESSAGE.EDIT_SUCCESS)
        closeModal(variant);
      })
      .catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
        NotificationComponent('error', TITLE.ERROR, MESSAGE.HAS_AN_ERROR)
      });
  };

  const handleCancel = (variant) => {
    form.resetFields();
    closeModal(variant);
  };

  const search = (value) => {
    const filteredData = data.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );

    setFilterTable(filteredData);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <PageTitle title={"Tra cứu khách hàng"} />
      <TableToolBar 
        className={'mb-3'} 
        placeholder={"Tìm kiếm tên khách hàng, địa chỉ, số điện thoại, email"}
        onSearch={search}
        showModal={showModal}
      />
      <Table
        columns={columns}
        data={filterTable == null ? data : filterTable}
        onChange={onChange}
        sticky={true}
      />
      <ModalCreateConsumer
        open={isModalCreateOpen}
        onOk={() => handleOk("create")}
        onCancel={() => handleCancel("create")}
      >
        <ConsumerForm variant="create" form={form} />
      </ModalCreateConsumer>

      <ModalEditConsumer
        open={isModalEditOpen}
        onOk={() => handleOk("edit")}
        onCancel={() => handleCancel("edit")}
      >
        <ConsumerForm variant="update" form={form} record={selectedRecord} />
      </ModalEditConsumer>
    </div>
  );
};
