import { Modal } from "antd";

export default function ModalEditSetting({
  open,
  onOk,
  onCancel,
  children
}) {
  return (
    <Modal
      title="Chỉnh sửa tham số"
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
