import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import "./styles/menu.component.css";
import {
  BookOutlined,
  TeamOutlined,
  BankOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const pathToSelectedKey = {
  "/book": "1a",
  "/book-type": "1b",
  "/author": "1c",
  "/book/storage": "1d",
  "/book/report": "1e",
  "/consumer": "2a",
  "/order": "3a",
  "/payment": "3b",
  "/payment/report": "3c",
  "/settings": "4",
};

const menuItems = [
  {
    key: "1",
    icon: <BookOutlined />,
    label: "Quản lý kho sách",
    submenu: [
      { key: "1a", label: "Tra cứu sách", path: "/book" },
      { key: "1b", label: "Tra cứu thể loại", path: "/book-type" },
      { key: "1c", label: "Tra cứu tác giả", path: "/author" },
      { key: "1d", label: "Tra cứu phiếu nhập sách", path: "/book/storage" },
      {
        key: "1e",
        label: "Lập báo cáo tồn kho",
        path: "/book/report",
      },
    ],
  },
  {
    key: "2",
    icon: <TeamOutlined />,
    label: "Quản lí khách hàng",
    submenu: [{ key: "2a", label: "Tra cứu khách hàng", path: "/consumer" }],
  },
  {
    key: "3",
    icon: <BankOutlined />,
    label: "Quản lí dòng tiền",
    submenu: [
      { key: "3a", label: "Tra cứu hóa đơn bán sách", path: "/order" },
      { key: "3b", label: "Tra cứu phiếu thu tiền", path: "/payment" },
      { key: "3c", label: "Lập báo cáo công nợ", path: "/payment/report" },
    ],
  },
  {
    key: "4",
    icon: <ToolOutlined />,
    label: "Tùy chỉnh",
    path: "/settings",
  },
];

// const redirectPage = (path) => {
//   window.location.assign(path);
// };

const getSelectedKey = () => {
  let path = window.location.pathname;
  return pathToSelectedKey[path];
};

export default function MenuComponent() {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState(getSelectedKey());

  useEffect(() => {
    setSelectedKey(pathToSelectedKey[window.location.pathname])
  }, [window.location.pathname])

  return (
    <Menu
      id="main-layout-menu"
      theme="light"
      mode="inline"
      selectedKeys={selectedKey}
    >
      {menuItems.map((item) =>
        item.submenu ? (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
            {item.submenu.map((subItem) => (
              <Menu.Item
                key={subItem.key}
                onClick={() => navigate(subItem.path)}
              >
                {subItem.label}
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Menu.Item>
        )
      )}
    </Menu>
  );
}
