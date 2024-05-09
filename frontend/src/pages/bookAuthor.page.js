import React, { lazy, useContext, useEffect, useState } from "react";
import { Form } from "antd";
import ModalContext from "../contexts/modal.context";
import EditButton from "../components/common/editButton.component";

const PageTitle = lazy(() =>
  import("../components/common/pageTitle.component")
);
const TableToolBar = lazy(() =>
  import("../components/common/tableToolBar.component")
);
const Table = lazy(() => import("../components/common/table.component"));
const ModalCreateBook = lazy(() =>
  import("../components/book-management/modalCreateBook.component")
);
const ModalEditBook = lazy(() =>
  import("../components/book-management/modalEditBook.component")
);
const BookAuthorForm = lazy(() =>
  import("../components/book-management/bookAuthor.component")
);

const columns = [
  {
    title: "Tác giả",
    dataIndex: "bookAuthor",
    key: "bookAuthor",
  },
  {
    title: "Chỉnh sửa",
    key: "edit",
    render: (record) => <EditButton record={record} />,
  },
];

// TODO: convert to state management to fetch data from server
const data = [
  {
    key: "1",
    bookAuthor: "F. Scott Fitzgerald",
  },
  {
    key: "2",
    bookAuthor: "George Orwell",
  },
  {
    key: "3",
    bookAuthor: "Jane Austen",
  },
  {
    key: "4",
    bookAuthor: "Harper Lee",
  },
];

export default function BookAuthorPage() {
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
        closeModal(variant);
      })
      .catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
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
      <PageTitle title={"Tra cứu tác giả"} />
      <TableToolBar
        className={"mb-3"}
        placeholder={"Tìm tác giả"}
        onSearch={search}
        showModal={showModal}
      />
      <Table
        columns={columns}
        data={filterTable == null ? data : filterTable}
        onChange={onChange}
        sticky={true}
      />

      <ModalCreateBook
        open={isModalCreateOpen}
        onOk={() => handleOk("create")}
        onCancel={() => handleCancel("create")}
      >
        <BookAuthorForm variant="create" form={form} />
      </ModalCreateBook>

      <ModalEditBook
        open={isModalEditOpen}
        onOk={() => handleOk("edit")}
        onCancel={() => handleCancel("edit")}
      >
        <BookAuthorForm variant="update" form={form} record={selectedRecord} />
      </ModalEditBook>
    </div>
  );
}
