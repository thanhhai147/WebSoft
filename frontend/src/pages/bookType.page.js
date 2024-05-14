import { Form } from "antd";
import React, { lazy, useContext, useEffect, useState } from "react";
import ModalContext from "../contexts/modal.context";
import EditButton from "../components/common/editButton.component";
import { TITLE, MESSAGE } from '../messages/main.message'
import { NotificationComponent } from "../components/common/notification.component"; 

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
const BookTypeForm = lazy(() =>
  import("../components/book-management/bookTypeForm.component")
);

const columns = [
  {
    title: "Thể loại",
    dataIndex: "bookType",
    key: "bookType",
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
    bookType: "Fiction",
  },
  {
    key: "2",
    bookType: "Classic",
  },
  {
    key: "3",
    bookType: "Fantasy",
  },
  {
    key: "4",
    bookType: "Programming",
  },
];

export default function BookTypePage() {
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
        NotificationComponent('success', TITLE.SUCCESS, variant === "create" ? MESSAGE.CREATE_SUCCESS : MESSAGE.EDIT_SUCCESS)
        closeModal(variant);
      })
      .catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
        NotificationComponent('error', TITLE.ERROR, MESSAGE.HAS_AN_ERROR)
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
      <PageTitle title={"Tra cứu thể loại"} />
      <TableToolBar
        className={"mb-3"}
        placeholder={"Tìm kiếm thể loại"}
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
        <BookTypeForm variant="create" form={form} />
      </ModalCreateBook>

      <ModalEditBook
        open={isModalEditOpen}
        onOk={() => handleOk("edit")}
        onCancel={() => handleCancel("edit")}
      >
        <BookTypeForm variant="update" form={form} record={selectedRecord} />
      </ModalEditBook>
    </div>
  );
}
