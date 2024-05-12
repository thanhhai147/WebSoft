import { TITLE, MESSAGE } from "../../messages/main.message";
import { NotificationComponent } from "../common/notification.component";
import { Input, Form } from "antd";

export default function CreateBookForm({ form }) {
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    NotificationComponent("warning", TITLE.WARNING, MESSAGE.HAS_AN_ERROR);
  };

  return (
    <Form form={form} layout="vertical" onFinishFailed={onFinishFailed}>
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
        <Input />
      </Form.Item>
      <Form.Item
        label="Thể loại"
        name="bookTypeName"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập thể loại",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Tác giả"
        name="authorName"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tác giả",
          },
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
}
