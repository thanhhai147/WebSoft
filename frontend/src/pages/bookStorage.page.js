import PageTitle from "../components/common/pageTitle.component";
import { useContext, useEffect, useState } from "react";
import TableToolBar from "../components/common/tableToolBar.component";
import ModalContext from "../contexts/modal.context";
import TableComponent from "../components/common/table.component";
import BaseAPIInstance from "../api/base.api";
import ModalCreateBook from "../components/book-management/modalCreateBook.component";
import { NotificationComponent } from "../components/common/notification.component";
import { TITLE } from "../messages/main.message";
import { Form } from "antd";
import CreateStorageForm from "../components/book-management/CreateStorageForm.component";
import moment from "moment";

const columns = [
  {
    title: "Tên sách",
    dataIndex: "BookName",
    key: "BookName",
  },
  {
    title: "Thể loại",
    dataIndex: "BookTypeName",
    key: "BookTypeName",
  },
  {
    title: "Tác giả",
    dataIndex: "AuthorName",
    key: "AuthorName",
  },
  {
    title: "Số lượng tồn kho",
    dataIndex: "quantity",
    key: "quantity",
    sorter: (a, b) => a.quantity - b.quantity,
  },
  {
    title: "Đơn giá nhập",
    dataIndex: "unitPrice",
    key: "unitPrice",
    sorter: (a, b) => a.unitPrice - b.unitPrice,
    render: (text) => text.toLocaleString("vi-VI") + " VND",
  },
  {
    title: "Ngày nhập",
    dataIndex: "Created",
    key: "Created",
    render: (text) => moment(text).format("DD/MM/YYYY"),
  },
];

export default function BookStorage() {
  const [bookStorages, setBookStorages] = useState([]);
  const [filterTable, setFilterTable] = useState(null);
  const { showModal, isModalCreateOpen, closeModal } = useContext(ModalContext);
  const [form] = Form.useForm();

  const fetchBookStorages = async () => {
    try {
      const response = await BaseAPIInstance.get("/storage/book-storage");

      // Add key property to each element in the array
      const data = response
        ? response.data.map((item, index) => ({
            ...item,
            key: index,
          }))
        : [];

      setBookStorages(data);
    } catch (error) {
      console.log("Failed to fetch book storages: ", error);
    }
  };

  // fetch all book storages
  useEffect(() => {
    fetchBookStorages();
  }, []);

  const search = (value) => {
    const filteredData = bookStorages.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );

    setFilterTable(filteredData);
  };

  const handleOk = (variant) => {
    form
      .validateFields()
      .then(async () => {
        const values = form.getFieldsValue();

        // Check if there are any duplicate book ids
        const bookIds = values.bookStorages.map((storage) => storage.bookId);
        const hasDuplicates = bookIds.some(
          (id, index) => bookIds.indexOf(id) !== index
        );

        if (hasDuplicates) {
          NotificationComponent(
            "warning",
            TITLE.WARNING,
            "Không được trùng mã sách"
          );
          return;
        }

        try {
          const response = await BaseAPIInstance.post(
            "/storage/book-storage/new",
            values.bookStorages
          );

          if (response.success === false) {
            NotificationComponent("error", TITLE.ERROR, response.message);
          } else {
            form.resetFields();
            closeModal(variant);

            fetchBookStorages();
            NotificationComponent("success", TITLE.SUCCESS, response.message);
          }
        } catch (error) {
          console.log("Failed to create book storage: ", error);
          NotificationComponent("error", TITLE.ERROR, error);
        }
      })
      .catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
        NotificationComponent("error", TITLE.WARNING, errorInfo);
      });
  };

  const handleCancel = (variant) => {
    form.resetFields();
    closeModal(variant);
  };

  return (
    <div>
      <PageTitle title={"Tra cứu phiếu nhập sách"} />
      <TableToolBar
        className={"mb-3"}
        placeholder={"Tìm kiếm..."}
        onSearch={search}
        showModal={showModal}
        deleteButton={false}
      />
      <TableComponent
        columns={columns}
        dataSource={filterTable == null ? bookStorages : filterTable}
        sticky={true}
        disableRowSelection={true}
      />

      <ModalCreateBook
        variant={"bookStorage"}
        open={isModalCreateOpen}
        onOk={() => handleOk("create")}
        onCancel={() => handleCancel("create")}
      >
        <CreateStorageForm form={form} />
      </ModalCreateBook>
    </div>
  );
}
