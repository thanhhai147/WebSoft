import { Form } from "antd";
import React, { lazy, useContext, useEffect, useState } from "react";
import ModalContext from "../contexts/modal.context";
import EditButton from "../components/common/editButton.component";
import { TITLE, MESSAGE } from "../messages/main.message";
import { NotificationComponent } from "../components/common/notification.component";
import BaseAPIInstance from "../api/base.api";
import UpdateBookForm from "../components/book-management/UpdateBookForm.component";

const PageTitle = lazy(() =>
  import("../components/common/pageTitle.component")
);
const TableToolBar = lazy(() =>
  import("../components/common/tableToolBar.component")
);

const Table = lazy(() => import("../components/common/table.component"));
const CreateBookForm = lazy(() =>
  import("../components/book-management/CreateBookForm.component")
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
    dataIndex: "bookTypeName",
    key: "bookTypeName",
  },
  {
    title: "Tác giả",
    dataIndex: "authorName",
    key: "authorName",
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
  const [books, setBooks] = useState([]);
  const [filterTable, setFilterTable] = useState(null);
  const [form] = Form.useForm();
  const {
    isModalCreateOpen,
    isModalEditOpen,
    showModal,
    closeModal,
    selectedRecord,
  } = useContext(ModalContext);

  // fetch all books
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BaseAPIInstance.get("/book");

        // Add key property to each element in the array
        const data = response
          ? response.data.map((item) => ({
              ...item,
              key: item.id,
            }))
          : [];

        setBooks(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleOk = (variant) => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        console.log("🚀 ~ .then ~ values:", values);
        // TODO: send form values to server

        form.resetFields();
        NotificationComponent(
          "success",
          TITLE.SUCCESS,
          variant === "create" ? MESSAGE.CREATE_SUCCESS : MESSAGE.EDIT_SUCCESS
        );
        closeModal(variant);
      })
      .catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
        NotificationComponent("error", TITLE.ERROR, MESSAGE.HAS_AN_ERROR);
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
        <CreateBookForm form={form} />
      </ModalCreateBook>

      <ModalEditBook
        variant={"book"}
        open={isModalEditOpen}
        onOk={() => handleOk("edit")}
        onCancel={() => handleCancel("edit")}
      >
        <UpdateBookForm form={form} record={selectedRecord} />
      </ModalEditBook>
    </div>
  );
}
