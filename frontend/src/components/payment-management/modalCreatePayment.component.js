import { Modal } from "antd";

export default function ModalCreatePayment({
  open,
  onOk,
  onCancel,
  children
}) {
  return (
    <Modal
      title="Tạo phiếu thu tiền"
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
