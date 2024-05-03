import { Modal } from "antd";

export default function ModalEditBook({
  open,
  onOk,
  onCancel,
  children,
  variant = "book" | "bookType" | "bookAuthor",
}) {
  return (
    <Modal
      title={
        variant === "book"
          ? "Chỉnh sửa sách"
          : variant === "bookType"
          ? "Chỉnh sửa thể loại"
          : "Chỉnh sửa tác giả"
      }
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
