import { Button, Form, InputNumber, Select } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import BaseAPIInstance from "../../api/base.api";
import { NotificationComponent } from "../common/notification.component";
import { MESSAGE, TITLE } from "../../messages/main.message";
import "./styles/CreateStorageForm.component.css";

export default function OrderForm({ form }) {
  const [books, setBooks] = useState([]);
  const [consumers, setConsumers] = useState([]);

  // fetch all consumers
  useEffect(() => {
    const fetchConsumers = async () => {
      try {
        const response = await BaseAPIInstance.get("/consumer");

        setConsumers(Object.values(response.data));
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

  return (
    <Form
      form={form}
      layout="vertical"
      size="middle"
      onFinishFailed={onFinishFailed}
    >
      <div style={{ display: "flex", gap: "10px" }}>
        <Form.Item
          label="Mã khách hàng"
          name="ConsumerId"
          rules={[{ required: true, message: "Vui lòng nhập mã khách hàng" }]}
          className="w-50"
        >
          <Select placeholder="Nhập mã khách hàng">
            {consumers.map((consumer, index) => (
              <Select.Option key={index} value={consumer.ConsumerId}>
                {consumer.ConsumerId} - {consumer.Name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Đã thanh toán"
          name="PaidValue"
          rules={[
            { required: true, message: "Vui lòng nhập tiền đã thanh toán" },
          ]}
          className="w-50"
        >
          <InputNumber className="w-100" placeholder="Tiền đã trả (VND)" />
        </Form.Item>
      </div>
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
                  style={{ width: "100%" }}
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
                  style={{ width: "100%" }}
                >
                  <InputNumber
                    className="w-100"
                    placeholder="Nhập số lượng"
                    min={1}
                  />
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
    </Form>
  );
}
