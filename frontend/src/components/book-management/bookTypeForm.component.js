import { TITLE, MESSAGE } from "../../messages/main.message";
import { NotificationComponent } from "../common/notification.component";
import { Form, Select } from "antd";
import { bookTypes } from "../../mock/book-type";

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

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    NotificationComponent("warning", TITLE.WARNING, MESSAGE.HAS_AN_ERROR);
  };

  return isCreateForm ? (
    <Form form={form} layout="vertical" onFinishFailed={onFinishFailed}>
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
        />
      </Form.Item>
    </Form>
  ) : (
    <Form form={form} layout="vertical" onFinishFailed={onFinishFailed}>
      <Form.Item label="Thể loại" name="bookType">
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
        />
      </Form.Item>
    </Form>
  );
}
