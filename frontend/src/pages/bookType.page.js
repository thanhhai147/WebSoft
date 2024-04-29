import React, { lazy, useState } from "react";

const PageTitle = lazy(() =>
  import("../components/common/pageTitle.component")
);
const TableToolBar = lazy(() =>
  import("../components/common/tableToolBar.component")
);
const Button = lazy(() => import("../components/common/button.component"));
const Table = lazy(() => import("../components/common/table.component"));

const columns = [
  {
    title: "Tên sách",
    dataIndex: "bookName",
    key: "bookName",
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
    title: "Số lượng tồn kho",
    dataIndex: "quantity",
    key: "quantity",
    sorter: (a, b) => a.quantity - b.quantity,
  },
  {
    title: "Chỉnh sửa",
    key: "edit",
    render: (text, record) => <Button buttonCase="edit" />,
  },
];

// TODO: convert to state management to fetch data from server
const data = [
  {
    key: "1",
    bookName: "Book 1",
    bookType: "Type 1",
    author: "Author 1",
    quantity: 100,
  },
  {
    key: "4",
    bookName: "Book Developer",
    bookType: "Type Programming",
    author: "Author 2",
    quantity: 100,
  },
  {
    key: "2",
    bookName: "Book 2",
    bookType: "Type 2",
    author: "Author 2",
    quantity: 200,
  },
  {
    key: "3",
    bookName: "Book 3",
    bookType: "Type 3",
    author: "Author 3",
    quantity: 300,
  },
];

export default function BookTypePage() {
  const [filterTable, setFilterTable] = useState(null);

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
      <PageTitle title={"Tra cứu Thể loại Sách"} />
      <TableToolBar
        className={"mb-3"}
        placeholder={"Tìm kiếm tên sách, thể loại, tác giả"}
        onSearch={search}
      />
      <Table
        columns={columns}
        data={filterTable == null ? data : filterTable}
        onChange={onChange}
        sticky={true}
      />
    </div>
  );
}
