import React, { lazy, useContext, useEffect, useState } from 'react'
import ConsumerUtil from '../helpers/consumer.utils'
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

const { getAllConsumer, createConsumer, editConsumer, deleteConsumer } = ConsumerUtil

const columns = [
  {
    title: "Tên khách hàng",
    dataIndex: "Name",
    key: "Name",
  },
  {
    title: "Địa chỉ",
    dataIndex: "Address",
    key: "Address",
  },
  {
    title: "Số điện thoại",
    dataIndex: "Phone",
    key: "Phone",
  },
  {
    title: "Email (nếu có)",
    dataIndex: "Email",
    key: "Email"
  },
  {
    title: "Công nợ",
    dataIndex: "Debt",
    key: "Debt",
    sorter: (a, b) => a.quantity - b.quantity,
  },
  {
    title: "Chỉnh sửa",
    key: "Edit",  
    render: (record) => <EditButton record={record} />,
  },
]

export default function ConsumerPage () {
  const [consumerTable, setConsumerTable] = useState(null)
  const [filterTable, setFilterTable] = useState(null);
  const [form] = Form.useForm();
  const {
    isModalCreateOpen,
    isModalEditOpen,
    showModal,
    closeModal,
    selectedRecord,
    isDelete,
    checkedRows
  } = useContext(ModalContext);

  useEffect(() => {
    form.setFieldsValue(selectedRecord);
  }, [form, selectedRecord]);

  useEffect(() => {
    getAllConsumer()
    .then(consumerData => setConsumerTable(consumerData))
  }, [])

  useEffect(() => {
    if(isDelete) {
      const consumerIdList = checkedRows.map(row => row.ConsumerId)
      deleteConsumer(consumerIdList).then(response => {
        if(response) {
          NotificationComponent('success', TITLE.SUCCESS, MESSAGE.DELETE_SUCCESS)
          getAllConsumer()
          .then(consumerData => setConsumerTable(consumerData))
        }
      })
    }
  }, [isDelete, checkedRows])

  const handleOk = (variant) => {
    form
      .validateFields()
      .then(async () => {
        const values = form.getFieldsValue();
        let consumerData = values

        if(consumerData.Email === null || consumerData.Email === undefined) consumerData.Email = ''

        const response = variant === "create" ? await createConsumer(consumerData) : await editConsumer(selectedRecord.ConsumerId, consumerData)

        if(response) {
          NotificationComponent('success', TITLE.SUCCESS, variant === "create" ? MESSAGE.CREATE_SUCCESS : MESSAGE.EDIT_SUCCESS)
          getAllConsumer()
          .then(consumerData => setConsumerTable(consumerData))
        }

        form.resetFields();
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
    const filteredData = consumerTable.filter((o) =>
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
        data={filterTable == null ? consumerTable : filterTable}
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
