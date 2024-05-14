import { TITLE, MESSAGE } from "../../messages/main.message";
import { NotificationComponent } from "../common/notification.component";
import { Input, Form } from "antd";

export default function CreateAuthorForm({ form }) {
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    NotificationComponent("warning", TITLE.WARNING, MESSAGE.HAS_AN_ERROR);
  };

  return (
    <Form form={form} layout="vertical" onFinishFailed={onFinishFailed}>
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
        <Input placeholder="Nhập tên tác giả" />
      </Form.Item>
    </Form>
  );
}
