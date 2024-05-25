import { Button, Form, Input, InputNumber, Select } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import BaseAPIInstance from "../../api/base.api";
import { NotificationComponent } from "../common/notification.component";
import { MESSAGE, TITLE } from "../../messages/main.message";
import "./styles/CreateStorageForm.component.css";
import ConsumerUtil from "../../helpers/consumer.utils";
const { getAllConsumer } = ConsumerUtil;

export default function OrderForm({ form }) {
  const [books, setBooks] = useState([]);
  const [consumers, setConsumers] = useState([]);

  // fetch all consumers
  useEffect(() => {
    const fetchConsumers = async () => {
      try {
        const response = await getAllConsumer();

        setConsumers(response);
      } catch (error) {
        console.log("Failed to fetch consumers: ", error);
      }
    };
    fetchConsumers();
  }, []);

  // fetch all books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await BaseAPIInstance.get("/book");

        const booksActive = response.data.filter(
          (book) => book.active === true
        );

        setBooks(booksActive);
      } catch (error) {
        console.log("Failed to fetch books: ", error);
      }
    };
    fetchBooks();
  }, []);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    NotificationComponent("warning", TITLE.WARNING, MESSAGE.HAS_AN_ERROR);
  };

  const handleValuesChange = (changedValues, allValues) => {
    const { BookOrder } = allValues;

    if (BookOrder) {
      // Update prices in BookOrder if BookOrder is changed
      const updatedBookOrder = BookOrder.map((bookOrder) => {
        if (bookOrder && bookOrder.BookId && bookOrder.Quantity) {
          const book = books.find((b) => b.id === bookOrder.BookId);
          if (book) {
            return {
              ...bookOrder,
              price: bookOrder.Quantity * book.price,
            };
          }
        }
        return bookOrder;
      });

      // Calculate total value
      const totalValue = updatedBookOrder.reduce((acc, curr) => {
        if (curr && curr.Quantity && curr.price) {
          return acc + curr.price; // curr.price is already Quantity * price
        }
        return acc;
      }, 0);

      // Set the updated fields
      form.setFieldsValue({
        BookOrder: updatedBookOrder,
        TotalValue: totalValue,
        RemainingValue: totalValue - (allValues.PaidValue || 0),
      });
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      size="middle"
      onFinishFailed={onFinishFailed}
      onValuesChange={handleValuesChange}
    >
      <Form.Item
        label="Ngày tạo hóa đơn"
        name="Date"
        initialValue={new Date().toLocaleDateString(["ban", "id"])}
      >
        <Input disabled={true} />
      </Form.Item>
      <Form.Item
        label="Mã khách hàng"
        name="ConsumerId"
        rules={[{ required: true, message: "Vui lòng nhập mã khách hàng" }]}
      >
        <Select placeholder="Nhập mã khách hàng">
          {consumers.map((consumer, index) => (
            <Select.Option key={index} value={consumer.ConsumerId}>
              {consumer.ConsumerId} - {consumer.Name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.List name="BookOrder">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div
                className="d-flex flex-row align-items-center justify-content-between"
                style={{ gap: "10px" }}
                key={key}
              >
                <Form.Item
                  {...restField}
                  label="Mã sách"
                  name={[name, "BookId"]}
                  rules={[{ required: true, message: "Vui lòng nhập mã sách" }]}
                  className="fit-content"
                >
                  <Select placeholder="Nhập mã sách">
                    {books.map((book, index) => (
                      <Select.Option key={index} value={book.id}>
                        {book.id} - {book.bookName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Số lượng"
                  name={[name, "Quantity"]}
                  rules={[
                    { required: true, message: "Vui lòng nhập số lượng" },
                  ]}
                  className="fit-content"
                >
                  <InputNumber
                    className="w-100"
                    placeholder="Nhập số lượng"
                    min={1}
                  />
                </Form.Item>
                <Form.Item {...restField} label="Giá" name={[name, "price"]}>
                  {/* Auto calculate price based on quantity books */}
                  <InputNumber className="w-100" disabled />
                </Form.Item>
                <MinusCircleOutlined
                  id="remove-storage-icon"
                  onClick={() => remove(name)}
                />
              </div>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Thêm sách
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <div style={{ display: "flex", gap: "10px" }}>
        <Form.Item label="Tổng tiền" name="TotalValue">
          <InputNumber
            className="w-100"
            placeholder="tổng tiền (VND)"
            disabled
            min={0}
          />
        </Form.Item>
        <Form.Item
          label="Đã thanh toán"
          name="PaidValue"
          rules={[
            { required: true, message: "Vui lòng nhập tiền đã thanh toán" },
          ]}
        >
          <InputNumber
            className="w-100"
            placeholder="tiền đã trả (VND)"
            min={0}
          />
        </Form.Item>
        <Form.Item label="Còn lại" name="RemainingValue">
          <InputNumber
            min={0}
            className="w-100"
            placeholder="tiền còn lại (VND)"
            disabled
          />
        </Form.Item>
      </div>
    </Form>
  );
}
