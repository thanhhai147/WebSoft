import React from "react";
import { Button } from "antd";
import {
  PlusCircleOutlined,
  DeleteOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "./styles/button.component.css";

export default function ButtonComponent({
  buttonCase,
  className,
  onClickEdit,
  onClickDelete,
  ...props
}) {
  switch (buttonCase) {
    case "create":
      return (
        <Button
          className={
            "btn-component btn-theme-color d-flex align-items-center justify-content-center" +
            " " +
            className
          }
          type="primary"
          icon={<PlusCircleOutlined />}
          {...props}
        >
          Tạo mới
        </Button>
      );
    case "delete":
      return (
        <Button
          className={
            "btn-component d-flex align-items-center justify-content-center" +
            " " +
            className
          }
          danger
          icon={<DeleteOutlined />}
          onClick={onClickDelete}
          {...props}
        >
          Xóa bỏ
        </Button>
      );
    case "logout":
      return (
        <Button
          className={
            "btn-component btn-theme-color d-flex align-items-center justify-content-center" +
            " " +
            className
          }
          type="primary"
          icon={<LogoutOutlined />}
          {...props}
        >
          Đăng xuất
        </Button>
      );
    case "login":
      return (
        <Button
          className={
            "btn-component btn-theme-color d-flex align-items-center justify-content-center" +
            " " +
            className
          }
          type="primary"
          {...props}
        >
          Xác nhận
        </Button>
      );
    case "edit":
      return (
        <Button
          className={
            "btn-component btn-theme-color d-flex align-items-center justify-content-center" +
            " " +
            className
          }
          type="primary"
          icon={<EditOutlined />}
          onClick={onClickEdit}
          {...props}
        >
          {/* Sửa */}
        </Button>
      );
    default:
      return (
        <Button
          className={
            "btn-component btn-theme-color d-flex align-items-center justify-content-center" +
            " " +
            className
          }
          type="primary"
          {...props}
        >
          {props.children}
        </Button>
      );
  }
}
