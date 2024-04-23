import React, { useState } from "react";
import { Menu } from "antd";
import "./styles/menu.component.css";
import {
    BookOutlined,
    TeamOutlined, 
    BankOutlined,
    ToolOutlined,
} from '@ant-design/icons';

const pathToSelectedKey = {
  "/book": "1a",
  "/book/storage": "1b",
  "/book/report": "1c",
  "/consumer": "2a",
  "/order": "3a",
  "/payment": "3b",
  "/payment/report": "3c",
  "/settings": "4"
}

const menuItems = [
  {
    key: "1",
    icon: <BookOutlined />,
    label: "Quản lý kho sách",
    submenu: [
      { key: "1a", label: "Tra cứu sách", path: "/book" },
      { key: "1b", label: "Tra cứu phiếu nhập sách", path: "/book/storage" },
      {
        key: "1c",
        label: "Lập báo cáo hàng tháng tồn kho",
        path: "/book/report",
      },
    ],
  },
  {
    key: "2",
    icon: <TeamOutlined />,
    label: "Quản lí khách hàng",
    submenu: [
      { key: "2a", label: "Tra cứu khách hàng", path: "/consumer" },
    ],
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

const redirectPage = (path) => {
    window.location.replace(path)
}

const getSelectedKey = () => {
  let path = window.location.pathname
  return pathToSelectedKey[path]
}

export default function MenuComponent() {
  const [selectedKey, setSelectedKey] = useState(getSelectedKey())

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
                onClick={() => redirectPage(subItem.path)}
              >
                {subItem.label}
              </Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={() => redirectPage(item.path)}
          >
            {item.label}
          </Menu.Item>
        )
      )}
    </Menu>
  );
}
