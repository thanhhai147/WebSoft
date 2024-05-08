import { Select, Form } from "antd";
import { authors } from "../../mock/authors";

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
        name="bookAuthor"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tác giả",
          },
        ]}
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
        />
      </Form.Item>
    </Form>
  ) : (
    <Form form={form} layout="vertical">
      <Form.Item label="Tác giả" name="bookAuthor">
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
    </Form>
  );
}
