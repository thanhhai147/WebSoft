import React, { useContext } from "react";
import { Input, Form, Select } from "antd";
import { TITLE, MESSAGE } from '../../messages/main.message'
import { NotificationComponent } from "../common/notification.component";
import ModalContext from "../../contexts/modal.context";

export default function ConsumerForm({
  variant = "update",
  form,
  record,
}) {
  const isCreateForm = variant === "create";
  const { isModalCreateOpen, isModalEditOpen } = useContext(ModalContext)

  if (isCreateForm && isModalCreateOpen) {
    form.resetFields();
  } else {
    if (isModalEditOpen) {
      form.setFieldsValue(record);
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    NotificationComponent('warning', TITLE.WARNING, MESSAGE.HAS_AN_ERROR)
  }; 

  return isCreateForm ? (null) : (
    <Form form={form} layout="vertical" onFinishFailed={onFinishFailed}>
      <Form.Item 
        label="Tên tham số" 
        name="ParameterName" 
        style={{ marginTop: "1rem" }}
      >
        <Input />
      </Form.Item>
      <Form.Item 
        label="Giá trị" 
        name="Value"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập giá trị",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item 
        label="Tình trạng" 
        name="Active"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn tình trạng",
          },
        ]}
      >
        <Select>
          <Select.Option value={true}>Khả dụng</Select.Option>
          <Select.Option value={false}>Không khả dụng</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );
}
