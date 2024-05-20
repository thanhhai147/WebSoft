import React, { lazy, useContext, useEffect, useState } from 'react'
import PaymentUtil from '../helpers/payment.utils'
import ConsumerUtil from '../helpers/consumer.utils'
import { Form } from 'antd'
import ModalContext from "../contexts/modal.context"
import { TITLE, MESSAGE } from '../messages/main.message'
import { NotificationComponent } from '../components/common/notification.component'

const PageTitle = lazy(() => import("../components/common/pageTitle.component"))
const TableToolBar = lazy(() => import("../components/common/tableToolBar.component"))
const Table = lazy(() => import("../components/common/table.component"))
const PaymentForm = lazy(() => import("../components/payment-management/paymentForm.component"))
const ModalCreatePayment = lazy(() => import("../components/payment-management/modalCreatePayment.component"))

const { getAllPayment, createPayment } = PaymentUtil
const { getConsumerById } = ConsumerUtil

const columns = [
  {
    title: "Ngày thu tiền",
    dataIndex: "Date",
    key: "Date",
    render: (text, record, index) => new Date(text).toLocaleDateString(['ban', 'id'])
  },
  {
    title: "Tên khách hàng",
    dataIndex: "ConsumerName",
    key: "ConsumerName",
  },
  {
    title: "Số tiền thu (VND)",
    dataIndex: "Value",
    key: "Value",
    sorter: (a, b) => a.quantity - b.quantity,
    render: (text, record, index) => text.toLocaleString()
  }
]

const getAllPaymentDetail = async () => {
  let paymentData = await getAllPayment()
  let uniqueConsumerIdList = [...new Set(paymentData.map(item => item.ConsumerId))]
  let consumerIdToName = {}
  const response = await Promise.all(uniqueConsumerIdList.map(consumerId => getConsumerById(consumerId)))
  if(response.every(value => value !== undefined)) {
    response.forEach(item => {
      consumerIdToName[item.ConsumerId] = item.Name
    })

    paymentData = paymentData.map(item => ({
      ConsumerName: consumerIdToName[item.ConsumerId],
      ...item
    }))
  }
  
  return paymentData
}

export default function PaymentPage () {
  const [paymentTable, setPaymentTable] = useState(null)
  const [filterTable, setFilterTable] = useState(null);
  const [form] = Form.useForm();
  const {
    isModalCreateOpen,
    showModal,
    closeModal,
    selectedRecord
  } = useContext(ModalContext);

  useEffect(() => {
    form.setFieldsValue(selectedRecord);
  }, [form, selectedRecord]);

  useEffect(() => {
    getAllPaymentDetail()
    .then(paymentData => setPaymentTable(paymentData))
  }, [])
  
  const handleOk = () => {
    form
      .validateFields()
      .then(async () => {
        const values = form.getFieldsValue();
        let paymentData = values

        const response = await createPayment(paymentData)

        if(response?.success) {
          NotificationComponent('success', TITLE.SUCCESS, MESSAGE.CREATE_SUCCESS)
          getAllPaymentDetail()
          .then(paymentData => setPaymentTable(paymentData))

          form.resetFields();
          closeModal('create');
        }
      })
      .catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
        NotificationComponent('error', TITLE.ERROR, MESSAGE.HAS_AN_ERROR)
      });
  };

  const handleCancel = () => {
    form.resetFields();
    closeModal('create');
  };

  const search = (value) => {
    const filteredData = paymentTable.filter((o) =>
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
      <PageTitle title={"Tra cứu phiếu thu tiền"} />
      <TableToolBar 
        className={'mb-3'} 
        placeholder={"Tìm ngày thu tiền, tên khách hàng"}
        onSearch={search}
        showModal={showModal}
        deleteButton={false}
      />
      <Table
        columns={columns}
        data={filterTable == null ? paymentTable : filterTable}
        onChange={onChange}
        sticky={true}
        disableRowSelection={true}
      />
      <ModalCreatePayment
        open={isModalCreateOpen}
        onOk={() => handleOk()}
        onCancel={() => handleCancel()}
      >
        <PaymentForm variant="create" form={form} />
      </ModalCreatePayment>
    </div>
  );
};
