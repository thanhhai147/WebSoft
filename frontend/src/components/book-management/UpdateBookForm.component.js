import { useEffect, useState } from "react";
import { NotificationComponent } from "../common/notification.component";
import { MESSAGE, TITLE } from "../../messages/main.message";
import { Form, Input, Select } from "antd";
import BaseAPIInstance from "../../api/base.api";

export default function UpdateBookForm({ form, record }) {
  const [bookTypes, setBookTypes] = useState([]);
  const [authors, setAuthors] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const newRecord = { ...record };
  useEffect(() => {
    form.setFieldsValue(newRecord);
  }, [form, newRecord]);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    NotificationComponent("warning", TITLE.WARNING, MESSAGE.HAS_AN_ERROR);
  };

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
            value: item.name, // change from item.id to item.name
            label: item.name,
          }))
        );
        setAuthors(
          authorResponse.data.map((item) => ({
            value: item.name, // change from item.id to item.name
            label: item.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Form form={form} layout="vertical" onFinishFailed={onFinishFailed}>
      <Form.Item label="Tên sách" name="bookName" style={{ marginTop: "1rem" }}>
        <Input placeholder="Nhập tên sách" />
      </Form.Item>
      <Form.Item label="Thể loại" name="bookTypeName">
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn thể loại"
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={bookTypes}
        />
      </Form.Item>
      <Form.Item label="Tác giả" name="authorName">
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn tác giả"
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label.toLowerCase() ?? "").includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase())
          }
          options={authors}
        />
      </Form.Item>
      <Form.Item label="Tình trạng" name="active">
        <Select>
          <Select.Option value={true}>Khả dụng</Select.Option>
          <Select.Option value={false}>Không khả dụng</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
}
