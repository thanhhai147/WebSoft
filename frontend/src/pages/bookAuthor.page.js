import React, {
  lazy,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Form } from "antd";
import ModalContext from "../contexts/modal.context";
import EditButton from "../components/common/editButton.component";
import { TITLE, MESSAGE } from "../messages/main.message";
import { NotificationComponent } from "../components/common/notification.component";
import CreateAuthorForm from "../components/book-management/CreateAuthorForm.component";
import BaseAPIInstance from "../api/base.api";
import UpdateAuthorForm from "../components/book-management/UpdateAuthorForm.component";

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
    title: "Mã tác giả",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Tác giả",
    dataIndex: "authorName",
    key: "authorName",
  },
  {
    title: "Chỉnh sửa",
    key: "edit",
    render: (record) => <EditButton record={record} />,
  },
];

export default function BookAuthorPage() {
  const [authors, setAuthors] = useState([]);
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

  // fetch all authors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await BaseAPIInstance.get("/author");

        // Add key property to each element in the array
        const data = response
          ? response.data.map((item) => ({
              ...item,
              authorName: item.name,
              key: item.id,
            }))
          : [];

        setAuthors(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // handle delete authors
  const handleDeleteAuthor = useCallback(async (authorIdList) => {
    if (authorIdList.length === 0) {
      NotificationComponent(
        "warning",
        TITLE.WARNING,
        MESSAGE.NO_RECORD_SELECTED
      );
      return;
    }

    try {
      const response = await Promise.all(
        authorIdList.map((id) => BaseAPIInstance.delete(`/author/${id}/delete`))
      );

      if (response.every((value) => value !== undefined)) {
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
      const authorIdList = checkedRows.map((row) => row.key);
      handleDeleteAuthor(authorIdList);
      setIsDelete(false);
      setCheckedRows([]);
    }
  }, [checkedRows, handleDeleteAuthor, isDelete, setCheckedRows, setIsDelete]);

  const handleCreateAuthor = async (values) => {
    try {
      const response = await BaseAPIInstance.post("/author/new", values);

      const newBookType = {
        ...response.data,
        key: authors.length + 1,
      };

      setAuthors([...authors, newBookType]);
    } catch (error) {
      console.error("Error creating book type: ", error);
      NotificationComponent("error", TITLE.ERROR, MESSAGE.HAS_AN_ERROR);
    }
  };

  const handleEditAuthor = async (values) => {
    try {
      const response = await BaseAPIInstance.put(
        `/author/${selectedRecord.key}/edit`,
        values
      );

      const updatedAuthor = {
        ...response.data,
      };

      const updatedData = authors.map((item) =>
        item.key === selectedRecord.key
          ? {
              ...item,
              authorName: updatedAuthor.authorName,
            }
          : item
      );

      setAuthors(updatedData);
    } catch (error) {
      console.error("Error editing book type: ", error);
      NotificationComponent("error", TITLE.ERROR, MESSAGE.HAS_AN_ERROR);
    }
  };

  const handleOk = (variant) => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        if (variant === "create") {
          handleCreateAuthor(values);
        } else {
          handleEditAuthor(values);
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
    const filteredData = authors.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );

    setFilterTable(filteredData);
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
        data={filterTable == null ? authors : filterTable}
        sticky={true}
      />

      <ModalCreateBook
        variant={"bookAuthor"}
        open={isModalCreateOpen}
        onOk={() => handleOk("create")}
        onCancel={() => handleCancel("create")}
      >
        <CreateAuthorForm variant="create" form={form} />
      </ModalCreateBook>

      <ModalEditBook
        variant={"bookAuthor"}
        open={isModalEditOpen}
        onOk={() => handleOk("edit")}
        onCancel={() => handleCancel("edit")}
      >
        <UpdateAuthorForm
          variant="update"
          form={form}
          record={selectedRecord}
        />
      </ModalEditBook>
    </div>
  );
}
