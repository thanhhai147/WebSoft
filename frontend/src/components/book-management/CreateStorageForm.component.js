import { Form, Input, Button, Select } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { NotificationComponent } from "../common/notification.component";
import { MESSAGE, TITLE } from "../../messages/main.message";
import { useEffect, useState } from "react";
import BaseAPIInstance from "../../api/base.api";

export default function CreateStorageForm({ form }) {
  const [bookIds, setBookIds] = useState([]);
  // fetch all book ids
  useEffect(() => {
    const fetchBookIds = async () => {
      try {
        const response = await BaseAPIInstance.get("/book");

        setBookIds([...response.data.map((item) => item.id)]);
      } catch (error) {
        console.log("Failed to fetch book ids: ", error);
      }
    };
    fetchBookIds();
  }, []);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    NotificationComponent("warning", TITLE.WARNING, MESSAGE.HAS_AN_ERROR);
  };

  return (
    <Form form={form} layout="vertical" onFinishFailed={onFinishFailed}>
      <Form.List name="bookStorages">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key}>
                <Form.Item
                  {...restField}
                  name={[name, "bookId"]}
                  rules={[{ required: true, message: "Vui lòng nhập mã sách" }]}
                >
                  <Select placeholder="Nhập mã sách">
                    {bookIds.map((bookId, index) => (
                      <Select.Option key={index} value={bookId}>
                        {bookId}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, "unitPrice"]}
                  rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                >
                  <Input placeholder="Nhập giá" type="number" />
                </Form.Item>
                <Form.Item
                  {...restField}
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
                  <Input placeholder="Nhập số lượng nhập" type="number" />
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
