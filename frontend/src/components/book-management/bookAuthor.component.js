import { Input, Form } from "antd";

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

  return isCreateForm ? (
    <Form form={form} layout="vertical">
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
