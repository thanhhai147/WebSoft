import React, { useContext } from "react";
import { Input, Form } from "antd";
import { TITLE, MESSAGE } from '../../messages/main.message'
import { NotificationComponent } from "../common/notification.component";
import ModalContext from "../../contexts/modal.context";

export default function ConsumerForm({
  variant = "create" | "update",
  form,
  record,
}) {
  const isCreateForm = variant === "create";
  const { isModalCreateOpen, isModalEditOpen } = useContext(ModalContext)

  if (isCreateForm && isModalCreateOpen) {
    form.resetFields();
  } else {
    if (isModalEditOpen) form.setFieldsValue(record);
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    NotificationComponent('warning', TITLE.WARNING, MESSAGE.HAS_AN_ERROR)
  }; 

  return isCreateForm ? (
    <Form form={form} layout="vertical" onFinishFailed={onFinishFailed}>
      <Form.Item
        label="Tên khách hàng"
        name="Name"
        style={{ marginTop: "1rem" }}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên khách hàng",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Địa chỉ"
        name="Address"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập địa chỉ",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Số điện thoại"
        name="Phone"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập số điện thoại",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="Email"
      >
        <Input />
      </Form.Item>
    </Form>
  ) : (
    <Form form={form} layout="vertical">
      <Form.Item 
        label="Tên khách hàng" 
        name="Name" 
        style={{ marginTop: "1rem" }}
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên khách hàng",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item 
        label="Địa chỉ" 
        name="Address"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập địa chỉ",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item 
        label="Số điện thoại" 
        name="Phone"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập số điện thoại",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item 
        label="Email" 
        name="Email"
      >
        <Input />
      </Form.Item>
    </Form>
  );
}
