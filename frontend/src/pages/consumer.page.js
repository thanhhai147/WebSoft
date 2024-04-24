import React, { lazy } from 'react'

const PageTitle = lazy(() => import("../components/common/pageTitle.component"))
const TableToolBar = lazy(() => import("../components/common/tableToolBar.component"))
const Button = lazy(() => import("../components/common/button.component"))
const Table = lazy(() => import("../components/common/table.component"))

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
    render: (text, record) => (
      <Button buttonCase='edit' />
    ),
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
];

export default function ConsumerPage () {
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <PageTitle title={"Tra cứu khách hàng"} />
      <TableToolBar className={'mb-3'} placeholder={"Tìm kiếm tên khách hàng, địa chỉ, số điện thoại, email"} />
      <Table columns={columns} data={data} onChange={onChange} sticky={true} />
    </div>
  );
};
