import { Input, Form } from "antd";

export default function BookForm({
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
      <Form.Item label="Tên sách" name="bookName" style={{ marginTop: "1rem" }}>
        <Input />
      </Form.Item>
      <Form.Item label="Thể loại" name="bookType">
        <Input />
      </Form.Item>
      <Form.Item label="Tác giả" name="bookAuthor">
        <Input />
      </Form.Item>
    </Form>
  );
}
