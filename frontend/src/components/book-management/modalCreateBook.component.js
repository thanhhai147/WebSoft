import { Modal } from "antd";
import "./styles/modal.component.css";

export default function ModalCreateBook({
  open,
  onOk,
  onCancel,
  children,
  variant = "book" | "bookType" | "bookAuthor" | "bookStorage" | "order",
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
          : variant === "bookStorage"
          ? "Tạo phiếu nhập sách"
          : "Tạo hóa đơn"
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
