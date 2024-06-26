import { useContext, useEffect, useState } from "react";
import ModalCreateBook from "../components/book-management/modalCreateBook.component";
import PageTitle from "../components/common/pageTitle.component";
import TableComponent from "../components/common/table.component";
import TableToolBar from "../components/common/tableToolBar.component";
import ModalContext from "../contexts/modal.context";
import OrderDetail from "../components/book-management/OrderDetail.component";
import { NotificationComponent } from "../components/common/notification.component";
import { TITLE } from "../messages/main.message";
import BaseAPIInstance from "../api/base.api";
import { Form } from "antd";
import OrderForm from "../components/book-management/OrderForm.component";

const columns = [
  {
    title: "Mã hóa đơn",
    dataIndex: "OrderId",
    key: "OrderId",
  },
  {
    title: "Mã khách hàng",
    dataIndex: "ConsumerId",
    key: "ConsumerId",
  },
  {
    title: "Ngày tạo",
    dataIndex: "Date",
    key: "Date",
    render: (text) => new Date(text).toLocaleDateString(["ban", "id"]),
    sorter: (a, b) => Date.parse(a.Date) - Date.parse(b.Date),
  },
  {
    title: "Tổng tiền (VND)",
    dataIndex: "TotalValue",
    key: "TotalValue",
    sorter: (a, b) => a.TotalValue - b.TotalValue,
    render: (text, record, index) => text.toLocaleString(),
  },
  {
    title: "Đã thanh toán (VND)",
    dataIndex: "PaidValue",
    key: "PaidValue",
    sorter: (a, b) => a.PaidValue - b.PaidValue,
    render: (text, record, index) => text.toLocaleString(),
  },
  {
    title: "Còn lại (VND)",
    dataIndex: "RemainingValue",
    key: "RemainingValue",
    sorter: (a, b) => a.RemainingValue - b.RemainingValue,
    render: (text, record, index) => text.toLocaleString(),
  },
];

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterTable, setFilterTable] = useState(null);
  const { showModal, isModalCreateOpen, isModalEditOpen, closeModal } = useContext(ModalContext);
  const [form] = Form.useForm();

  const fetchOrders = async () => {
    try {
      const response = await BaseAPIInstance.get("/order");
      const dataArr = Object.values(response.data); // convert object to array

      // Add key property to each element in the array
      const data = response
        ? dataArr.map((item, index) => ({
            ...item,
            key: index,
          }))
        : [];

      setOrders(data);
    } catch (error) {
      console.log("Failed to fetch orders: ", error);
    }
  };

  // fetch all orders
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOk = (variant) => {
    form
      .validateFields()
      .then(async () => {
        const values = form.getFieldsValue();

        // Check if there are any duplicate book ids
        const bookIds = values.BookOrder.map((book) => book.BookId);
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
          const response = await BaseAPIInstance.post("/order/create", values);

          if (response.success === false) {
            NotificationComponent("error", TITLE.ERROR, response.message);
          } else {
            form.resetFields();
            closeModal(variant);

            fetchOrders();
            NotificationComponent("success", TITLE.SUCCESS, response.message);
          }
        } catch (error) {
          console.log("Failed to create order: ", error);
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

  const search = (value) => {
    const filteredData = orders.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );

    setFilterTable(filteredData);
  };

  const onRowClick = async (record, index, event) => {
    const response = await BaseAPIInstance.get(`/order/${record.OrderId}/detail`);
    const orderDetail = response.data
    showModal("edit")
    setSelectedOrder(orderDetail)
  }

  return (
    <div>
      <PageTitle title={"Tra cứu hóa đơn"} />
      <TableToolBar
        className={"mb-3"}
        placeholder={"Tìm kiếm..."}
        onSearch={search}
        showModal={showModal}
        deleteButton={false}
      />
      <TableComponent
        columns={columns}
        dataSource={filterTable == null ? orders : filterTable}
        sticky={true}
        disableRowSelection={true}
        onClick={onRowClick}
      />
      <ModalCreateBook
        variant={"order"}
        open={isModalCreateOpen}
        onOk={() => handleOk("create")}
        onCancel={() => handleCancel("create")}
      >
        <OrderForm form={form} />
      </ModalCreateBook>
      <ModalCreateBook
        variant={"order_detail"}
        open={isModalEditOpen}
        onCancel={() => handleCancel("edit")}
      >
        <OrderDetail data={selectedOrder} />
      </ModalCreateBook>
    </div>
  );
}
