import { Modal } from "antd";
import "./styles/modalCreateBook.component.css"

export default function ModalCreateBook({
  open,
  onOk,
  onCancel,
  children,
  variant = "book" | "bookType" | "bookAuthor" | "bookStorage",
}) {
  return (
    <Modal
      title={
        variant === "book"
          ? "Tạo mới sách"
          : variant === "bookType"
          ? "Thêm thể loại"
          : variant === "bookAuthor"
          ? "Thêm tác giả"
          : "Phiếu nhập sách"
      }
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      centered
      okText={"Tạo mới"}
      className={`modal-create-${variant}`}
    >
      {children}
    </Modal>
  );
}
