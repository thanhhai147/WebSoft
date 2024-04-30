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
    title: "Thể loại",
    dataIndex: "bookType",
    key: "bookType",
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
    bookType: "Type 1",
  },
  {
    key: "4",
    bookType: "Type Programming",
  },
  {
    key: "2",
    bookType: "Type 2",
  },
  {
    key: "3",
    bookType: "Type 3",
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
      <PageTitle title={"Tra cứu thể loại sách"} />
      <TableToolBar
        className={"mb-3"}
        placeholder={"Tìm kiếm thể loại"}
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
