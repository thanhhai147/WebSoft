import { Modal } from "antd";

export default function ModalCreateConsumer({
  open,
  onOk,
  onCancel,
  children
}) {
  return (
    <Modal
      title="Tạo mới khách hàng"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      centered
      okText={"Tạo mới"}
    >
      {children}
    </Modal>
  );
}
