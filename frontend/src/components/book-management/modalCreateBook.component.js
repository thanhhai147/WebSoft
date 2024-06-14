import { Modal } from "antd";
import "./styles/modal.component.css";

export default function ModalCreateBook({
  open,
  onOk,
  onCancel,
  children,
  variant = "book" | "bookType" | "bookAuthor" | "bookStorage" | "order" | "detail_order",
}) {
  return (
    variant === "order_detail" ?
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
            : variant === "order" 
            ? "Tạo hóa đơn"
            : "Chi tiết hóa đơn"
        }
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        centered
        okText={"Tạo mới"}
        className={`modal-create-${variant}`}
        footer={null}
      >
        {children}
      </Modal>
    :
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
            : variant === "order" 
            ? "Tạo hóa đơn"
            : "Chi tiết hóa đơn"
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
