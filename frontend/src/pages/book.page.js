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
const UpdateBookForm = lazy(() => 
  import("../components/book-management/UpdateBookForm.component")
)
const ModalCreateBook = lazy(() =>
  import("../components/book-management/modalCreateBook.component")
);
const ModalEditBook = lazy(() =>
  import("../components/book-management/modalEditBook.component")
);

const BookStatusComponent = lazy(() => 
  import("../components/common/bookStatus.component")
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
    render: (text, record, index) => text.toLocaleString(),
    sorter: (a, b) => a.quantity - b.quantity,
  },
  {
    title: "Tình trạng",
    dataIndex: "active",
    key: "active",
    render: (text, record, index) => text ? <BookStatusComponent variant={'active'} /> : <BookStatusComponent variant={'inactive'}/>
  },
  {
    title: "Chỉnh sửa",
    key: "edit",
    render: (record) => <EditButton record={record} />,
  },
];

export default function BookPage() {
  const [books, setBooks] = useState([]);
  const [bookTypes, setBookTypes] = useState([]);
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
  } = useContext(ModalContext);

  // fetch all books
  const fetchBooks = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // fetch all authors and book types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookTypeResponse, authorResponse] = await Promise.all([
          BaseAPIInstance.get("/book-type"),
          BaseAPIInstance.get("/author"),
        ]);

        setBookTypes(
          bookTypeResponse.data.map((item) => ({
            value: item.id,
            label: item.name,
          }))
        );
        setAuthors(
          authorResponse.data.map((item) => ({
            value: item.id,
            label: item.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // handle delete books
  const handleDeleteBooks = useCallback(async (bookIdList) => {
    if (bookIdList.length === 0) {
      NotificationComponent(
        "warning",
        TITLE.WARNING,
        MESSAGE.NO_RECORD_SELECTED
      );
      return;
    }

    const response = await Promise.all([
      bookIdList.map((id) => BaseAPIInstance.delete(`/book/${id}/delete`)),
    ]);
    if (response.every(value => value !== undefined)) {
      NotificationComponent("success", TITLE.SUCCESS, MESSAGE.DELETE_SUCCESS);

      fetchBooks();
      form.resetFields();
    }
  }, []);

  useEffect(() => {
    if (isDelete) {
      const bookIdList = checkedRows.map((row) => row.id);
      handleDeleteBooks(bookIdList);
      setIsDelete(false);
    }
  }, [checkedRows, handleDeleteBooks, isDelete, setIsDelete]);

  const handleCreateBook = async (values) => {
    const response = await BaseAPIInstance.post("/book/new", {
      ...values,
      // active: false,
    });

    if(response?.success) {
      NotificationComponent("success", TITLE.SUCCESS, MESSAGE.CREATE_SUCCESS)

      fetchBooks()

      form.resetFields();
      closeModal("create");
    }
  };

  const handleEditBook = async (values) => {
    // convert bookTypeName and authorName to bookTypeId and authorId
    const bookType = bookTypes.find(
      (item) => item.label === values.bookTypeName
    );
    const author = authors.find((item) => item.label === values.authorName);

    const bookUpdate = {
      bookName: values.bookName,
      bookTypeId: bookType ? bookType.value : null,
      authorId: author ? author.value : null,
      active: values.active,
    };

    const response = await BaseAPIInstance.put(
      `/book/${selectedRecord.id}/edit`,
      bookUpdate
    )

    if (response?.success) {
      NotificationComponent("success", TITLE.SUCCESS, MESSAGE.EDIT_SUCCESS)

      form.resetFields();
      closeModal("edit");

      fetchBooks()
    }
  };

  const handleOk = (variant) => {
    form
      .validateFields()
      .then(() => {
        const values = form.getFieldsValue();
        // handle create or edit book
        if (variant === "create") {
          handleCreateBook(values);
        } else {
          handleEditBook(values);
        }
      })
      .catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
        NotificationComponent("error", TITLE.WARNING, MESSAGE.HAS_AN_ERROR);
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
