import { Form, Button, Select, InputNumber } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { NotificationComponent } from "../common/notification.component";
import { MESSAGE, TITLE } from "../../messages/main.message";
import { useEffect, useState } from "react";
import BaseAPIInstance from "../../api/base.api";

export default function CreateStorageForm({ form }) {
  const [books, setBooks] = useState([]);

  // fetch all books
  useEffect(() => {
    const fetchBookIds = async () => {
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
    fetchBookIds();
  }, []);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    NotificationComponent("warning", TITLE.WARNING, MESSAGE.HAS_AN_ERROR);
  };

  return (
    <Form form={form} layout="inline" onFinishFailed={onFinishFailed}>
      <Form.List name="bookStorages">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key}>
                <Form.Item
                  {...restField}
                  label="Mã sách"
                  name={[name, "bookId"]}
                  rules={[{ required: true, message: "Vui lòng nhập mã sách" }]}
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
                  label="Giá (VND)"
                  name={[name, "unitPrice"]}
                  rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                >
                  <InputNumber
                    placeholder="Nhập giá (VND)"
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item
                  {...restField}
                  label="Số lượng nhập"
                  style={{ marginBottom: "5px" }}
                  name={[name, "quantity"]}
                  rules={[
                    { required: true, message: "Vui lòng nhập số lượng nhập" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || value >= 150) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Số lượng nhập ít nhất là 150 cuốn")
                        );
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    placeholder="Nhập số lượng nhập"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
                <MinusCircleOutlined
                  style={{ marginBottom: "30px" }}
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
