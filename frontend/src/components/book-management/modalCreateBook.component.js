import { Modal } from "antd";

export default function ModalCreateBook({
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
          ? "Tạo mới sách"
          : variant === "bookType"
          ? "Thêm thể loại"
          : "Thêm tác giả"
      }
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
