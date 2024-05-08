import { Form } from "antd";
import React, { lazy, useContext, useEffect, useState } from "react";
import BookContext from "../contexts/book.context";
import EditButton from "../components/book-management/editButton.component";
import { books } from "../mock/books";

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

export default function BookPage() {
  const [filterTable, setFilterTable] = useState(null);
  const [form] = Form.useForm();
  const {
    isModalCreateOpen,
    isModalEditOpen,
    showModal,
    closeModal,
    selectedRecord,
  } = useContext(BookContext);

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
    const filteredData = books.filter((o) =>
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
        data={filterTable == null ? books : filterTable}
        onChange={onChange}
        sticky={true}
      />

      <ModalCreateBook
        variant={"book"}
        open={isModalCreateOpen}
        onOk={() => handleOk("create")}
        onCancel={() => handleCancel("create")}
      >
        <BookForm variant="create" form={form} />
      </ModalCreateBook>

      <ModalEditBook
        variant={"book"}
        open={isModalEditOpen}
        onOk={() => handleOk("edit")}
        onCancel={() => handleCancel("edit")}
      >
        <BookForm variant="update" form={form} record={selectedRecord} />
      </ModalEditBook>
    </div>
  );
}
