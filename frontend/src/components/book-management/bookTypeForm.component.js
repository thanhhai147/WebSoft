import { Input, Form } from "antd";

export default function BookTypeForm({
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
        label="Thể loại"
        name="bookType"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập thể loại",
          },
        ]}
      >
        <Input />
      </Form.Item>
    </Form>
  ) : (
    <Form form={form} layout="vertical">
      <Form.Item label="Thể loại" name="bookType">
        <Input />
      </Form.Item>
    </Form>
  );
}
