import React, { useContext, useEffect, useState } from "react";
import { Input, Form, Select, InputNumber } from "antd";
import { TITLE, MESSAGE } from '../../messages/main.message'
import { NotificationComponent } from "../common/notification.component";
import ModalContext from "../../contexts/modal.context";
import ConsumeUtil from "../../helpers/consumer.utils";

const { getAllConsumer } = ConsumeUtil

export default function ConsumerForm({
  variant = "create",
  form,
  record,
}) {
  const [consumer, setConsumer] = useState(null)
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

  useEffect(() => {
    getAllConsumer()
    .then(consumerData => {
      setConsumer(consumerData.map(item => ({
        value: item.ConsumerId,
        label: item.Name,
      })))
    })
  }, [])
  
  return isCreateForm ? (
    <Form form={form} layout="vertical" onFinishFailed={onFinishFailed}>
      <Form.Item
        label="Ngày thu tiền"
        name="Date"
        style={{ marginTop: "1rem" }}
        initialValue={new Date().toLocaleDateString(['ban', 'id'])}
      >
        <Input disabled={true} />
      </Form.Item>
      <Form.Item
        label="Khách hàng"
        name="ConsumerId"
        rules={[
          {
            required: true,
            message: "Vui chọn khách hàng",
          },
        ]}
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Chọn khách hàng"
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
          options={consumer}
          defaultValue={null}
        />
      </Form.Item>
      <Form.Item
        label="Số tiền thu (VND)"
        name="Value"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập số tiền thu",
          },
        ]}
      >
        <InputNumber 
          style={{width: "100%"}}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          parser={(value) => value?.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>
    </Form>
  ) : (null);
}
