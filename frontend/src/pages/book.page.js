import { Form } from "antd";
import React, { lazy, useContext, useEffect, useState } from "react";
import ModalContext from "../contexts/modal.context";
import EditButton from "../components/common/editButton.component";

const PageTitle = lazy(() =>
  import("../components/common/pageTitle.component")
);
const TableToolBar = lazy(() =>
  import("../components/common/tableToolBar.component")
);

const Table = lazy(() => import("../components/common/table.component"));
const BookForm = lazy(() =>
  import("../components/book-management/bookForm.component")
);
const ModalCreateBook = lazy(() =>
  import("../components/book-management/modalCreateBook.component")
);
const ModalEditBook = lazy(() =>
  import("../components/book-management/modalEditBook.component")
);

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
    dataIndex: "bookAuthor",
    key: "bookAuthor",
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
    render: (record) => <EditButton record={record} />,
  },
];

// TODO: convert to state management to fetch data from server
const data = [
  {
    key: "1",
    bookName: "The Great Gatsby",
    bookType: "Fiction",
    bookAuthor: "F. Scott Fitzgerald",
    quantity: 10,
  },
  {
    key: "2",
    bookName: "1984",
    bookType: "Fiction",
    bookAuthor: "George Orwell",
    quantity: 12,
  },
  {
    key: "3",
    bookName: "Pride and Prejudice",
    bookType: "Classic",
    bookAuthor: "Jane Austen",
    quantity: 6,
  },
  {
    key: "4",
    bookName: "To Kill a Mockingbird",
    bookType: "Fiction",
    bookAuthor: "Harper Lee",
    quantity: 8,
  },
  {
    key: "5",
    bookName: "Harry Potter and the Philosopher's Stone",
    bookType: "Fantasy",
    bookAuthor: "J.K. Rowling",
    quantity: 15,
  },
];

export default function BookPage() {
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
      <PageTitle title={"Tra cứu sách"} />
      <TableToolBar
        className={"mb-3"}
        placeholder={"Tìm kiếm tên sách, thể loại, tác giả"}
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
        <BookForm variant="create" form={form} />
      </ModalCreateBook>

      <ModalEditBook
        open={isModalEditOpen}
        onOk={() => handleOk("edit")}
        onCancel={() => handleCancel("edit")}
      >
        <BookForm variant="update" form={form} record={selectedRecord} />
      </ModalEditBook>
    </div>
  );
}
