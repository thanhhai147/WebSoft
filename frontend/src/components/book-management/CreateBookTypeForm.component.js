import { TITLE, MESSAGE } from "../../messages/main.message";
import { NotificationComponent } from "../common/notification.component";
import { Input, Form } from "antd";

export default function CreateBookTypeForm({ form }) {
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    NotificationComponent("warning", TITLE.WARNING, MESSAGE.HAS_AN_ERROR);
  };

  return (
    <Form form={form} layout="vertical" onFinishFailed={onFinishFailed}>
      <Form.Item
        label="Thể loại"
        name="bookTypeName"
        style={{ marginTop: "1rem" }}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập thể loại",
          },
        ]}
      >
        <Input placeholder="Nhập loại sách" />
      </Form.Item>
    </Form>
  );
}
