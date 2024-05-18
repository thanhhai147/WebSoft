import { Form } from "antd";
import React, {
  lazy,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import ModalContext from "../contexts/modal.context";
import EditButton from "../components/common/editButton.component";
import { TITLE, MESSAGE } from "../messages/main.message";
import { NotificationComponent } from "../components/common/notification.component";
import BaseAPIInstance from "../api/base.api";
import CreateBookTypeForm from "../components/book-management/CreateBookTypeForm.component";
import UpdateBookTypeForm from "../components/book-management/UpdateBookTypeForm.component";

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

const columns = [
  {
    title: "Thể loại",
    dataIndex: "bookTypeName",
    key: "bookTypeName",
  },
  {
    title: "Chỉnh sửa",
    key: "edit",
    render: (record) => <EditButton record={record} />,
  },
];

export default function BookTypePage() {
  const [bookTypes, setBookTypes] = useState([]);
  const [filterTable, setFilterTable] = useState(null);
  const [form] = Form.useForm();
  const {
    isModalCreateOpen,
    isModalEditOpen,
    showModal,
    closeModal,
    selectedRecord,
    isDelete,
    setIsDelete,
    checkedRows,
    setCheckedRows,
  } = useContext(ModalContext);

  // fetch all book types
  const fetchBookTypes = useCallback(async () => {
    try {
      const response = await BaseAPIInstance.get("/book-type");

      // Add key property to each element in the array
      const data = response
        ? response.data.map((item) => ({
            bookTypeName: item.name,
            key: item.id,
          }))
        : [];

      setBookTypes(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }, []);

  useEffect(() => {
    fetchBookTypes();
  }, [fetchBookTypes]);

  // handle delete book types
  const handleDeleteBookTypes = useCallback(async (ids) => {
    if (ids.length === 0) {
      NotificationComponent(
        "warning",
        TITLE.WARNING,
        MESSAGE.NO_RECORD_SELECTED
      );
      return;
    }

    try {
      const response = await Promise.all(
        ids.map((id) => BaseAPIInstance.delete(`/book-type/${id}/delete`))
      );

      if (response) {
        NotificationComponent("success", TITLE.SUCCESS, MESSAGE.DELETE_SUCCESS);
      }

      window.location.reload();
    } catch (error) {
      console.error("Error deleting book types: ", error);
      NotificationComponent("error", TITLE.ERROR, MESSAGE.HAS_AN_ERROR);
    }
  }, []);

  useEffect(() => {
    if (isDelete) {
      const ids = checkedRows.map((row) => row.key);
      handleDeleteBookTypes(ids);
      setIsDelete(false);
      setCheckedRows([]);
    }
  }, [
    checkedRows,
    handleDeleteBookTypes,
    isDelete,
    setCheckedRows,
    setIsDelete,
  ]);

  const handleCreateBookType = async (values) => {
    try {
      const response = await BaseAPIInstance.post("/book-type/new", values);

      const newBookType = {
        ...response.data,
        key: bookTypes.length + 1,
      };

      setBookTypes([...bookTypes, newBookType]);
    } catch (error) {
      console.error("Error creating book type: ", error);
      NotificationComponent("error", TITLE.ERROR, MESSAGE.HAS_AN_ERROR);
    }
  };

  const handleEditBookType = async (values) => {
    try {
      const response = await BaseAPIInstance.put(
        `/book-type/${selectedRecord.key}/edit`,
        values
      );

      const updatedBookType = {
        ...response.data,
      };

      const updatedData = bookTypes.map((item) =>
        item.key === selectedRecord.key
          ? {
              ...item,
              bookTypeName: updatedBookType.bookTypeName,
            }
          : item
      );

      setBookTypes(updatedData);
    } catch (error) {
      console.error("Error updating book type: ", error);
      NotificationComponent("error", TITLE.ERROR, MESSAGE.HAS_AN_ERROR);
    }
  };

  const handleOk = (variant) => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        if (variant === "create") {
          handleCreateBookType(values);
        } else {
          handleEditBookType(values);
        }

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
    const filteredData = bookTypes.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );

    setFilterTable(filteredData);
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
        data={filterTable == null ? bookTypes : filterTable}
        sticky={true}
      />

      <ModalCreateBook
        variant={"bookType"}
        open={isModalCreateOpen}
        onOk={() => handleOk("create")}
        onCancel={() => handleCancel("create")}
      >
        <CreateBookTypeForm form={form} />
      </ModalCreateBook>

      <ModalEditBook
        variant={"bookType"}
        open={isModalEditOpen}
        onOk={() => handleOk("edit")}
        onCancel={() => handleCancel("edit")}
      >
        <UpdateBookTypeForm form={form} record={selectedRecord} />
      </ModalEditBook>
    </div>
  );
}
