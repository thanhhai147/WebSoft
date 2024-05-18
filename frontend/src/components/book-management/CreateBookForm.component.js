import { useEffect, useState } from "react";
import { TITLE, MESSAGE } from "../../messages/main.message";
import { NotificationComponent } from "../common/notification.component";
import { Input, Form, Select } from "antd";
import BaseAPIInstance from "../../api/base.api";

export default function CreateBookForm({ form }) {
  const [bookTypes, setBookTypes] = useState([]);
  const [authors, setAuthors] = useState([]);

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

  return (
    <Form form={form} layout="vertical" onFinishFailed={onFinishFailed} initialValues={null}>
      <Form.Item
        label="Tên sách"
        name="bookName"
        style={{ marginTop: "1rem" }}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên sách",
          },
        ]}
      >
        <Input placeholder="Nhập tên sách" />
      </Form.Item>
      <Form.Item
        label="Thể loại"
        name="bookTypeId"
        initialValue={null}
      >
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
          defaultValue={null}
        />
      </Form.Item>
      <Form.Item
        label="Tác giả"
        name="authorId"
        initialValue={null}
      >
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
          defaultValue={null}
        />
      </Form.Item>
    </Form>
  );
}
