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
    title: "Tác giả",
    dataIndex: "author",
    key: "author",
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
    author: "Author 1",
  },
  {
    key: "4",
    author: "Author 2",
  },
  {
    key: "2",
    author: "Author 2",
  },
  {
    key: "3",
    author: "Author 3",
  },
];

export default function BookAuthorPage() {
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
      <PageTitle title={"Tra cứu tác giả"} />
      <TableToolBar
        className={"mb-3"}
        placeholder={"Tìm tác giả"}
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
