import { Modal } from "antd";

export default function ModalEditConsumer({
  open,
  onOk,
  onCancel,
  children
}) {
  return (
    <Modal
      title="Chỉnh sửa khách hàng"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      centered
      okText={"Lưu"}
    >
      {children}
    </Modal>
  );
}
