import React, { lazy } from 'react'

const PageTitle = lazy(() => import("../components/common/pageTitle.component"))
const TableToolBar = lazy(() => import("../components/common/tableToolBar.component"))
const Button = lazy(() => import("../components/common/button.component"))
const Table = lazy(() => import("../components/common/table.component"))

const columns = [
  {
    title: "Tên sách",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Thể loại",
    dataIndex: "bookType",
    key: "bookType",
  },
  {
    title: "Tác giả",
    dataIndex: "author",
    key: "author",
  },
  {
    title: "Số lượng tồn",
    dataIndex: "quantity",
    key: "quantity",
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
    name: "Book 1",
    bookType: "Type 1",
    author: "Author 1",
    quantity: 100,
  },
  {
    key: "2",
    name: "Book 2",
    bookType: "Type 2",
    author: "Author 2",
    quantity: 200,
  },
  {
    key: "3",
    name: "Book 3",
    bookType: "Type 3",
    author: "Author 3",
    quantity: 300,
  },
];

const bookPageContent = () => {
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <PageTitle title={"Tra cứu sách"} />
      <TableToolBar className={'mb-3'} />
      <Table columns={columns} data={data} onChange={onChange} sticky={true} />
    </div>
  );
};

export default bookPageContent
