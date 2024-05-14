import { Input, Form } from "antd";
import { TITLE, MESSAGE } from '../../messages/main.message'
import { NotificationComponent } from '../common/notification.component'

export default function BookAuthorForm({
  variant = "create" | "update",
  form,
  record,
}) {
  const isCreateForm = variant === "create";

  if (!isCreateForm) {
    form.setFieldsValue(record);
  } else {
    form.resetFields();
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    NotificationComponent('warning', TITLE.WARNING, MESSAGE.HAS_AN_ERROR)
  };    

  return isCreateForm ? (
    <Form form={form} layout="vertical" onFinishFailed={onFinishFailed}>
      <Form.Item
        label="Tác giả"
        name="author"
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
  ) : (
    <Form form={form} layout="vertical">
      <Form.Item label="Tác giả" name="bookAuthor">
        <Input />
      </Form.Item>
    </Form>
  );
}
