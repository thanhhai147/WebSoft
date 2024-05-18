import { useEffect } from "react";
import { TITLE, MESSAGE } from "../../messages/main.message";
import { NotificationComponent } from "../common/notification.component";
import { Form, Input } from "antd";

export default function UpdateAuthorForm({ form, record }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const newRecord = { ...record };
  useEffect(() => {
    form.setFieldsValue(newRecord);
  }, [form, newRecord]);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    NotificationComponent("warning", TITLE.WARNING, MESSAGE.HAS_AN_ERROR);
  };

  return (
    <Form form={form} layout="vertical" onFinishFailed={onFinishFailed}>
      <Form.Item
        label="Tác giả"
        name="authorName"
        style={{ marginTop: "1rem" }}
      >
        <Input placeholder="Nhập tên tác giả" />
      </Form.Item>
    </Form>
  );
}
