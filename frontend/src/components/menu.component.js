import React from "react";
import { Menu } from "antd";
import "./styles/menu.component.css";
import {
    UserOutlined,
    BookOutlined,
    TeamOutlined, 
    BankOutlined,
    ToolOutlined,
} from '@ant-design/icons';

const menuItems = [
  {
    key: "1",
    icon: <BookOutlined />,
    label: "Quản lý kho sách",
    submenu: [
      { key: "1a", label: "Tra cứu sách", path: "/book" },
      { key: "1b", label: "Lập phiếu nhập sách", path: "/book/new" },
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
      { key: "2b", label: "Lập khách hàng mới", path: "/consumer/new" },
    ],
  },
  {
    key: "3",
    icon: <BankOutlined />,
    label: "Quản lí dòng tiền",
    submenu: [
      { key: "3a", label: "Lập hóa đơn bán sách", path: "/order/new" },
      { key: "3b", label: "Lập phiếu thu tiền", path: "payment/new" },
      { key: "3c", label: "Lập báo cáo công nợ", path: "payment/report" },
    ],
  },
  {
    key: "4",
    icon: <ToolOutlined />,
    label: "Tùy chỉnh",
    path: "/setting",
  },
];

const redirectPage = (path) => {
    window.location.replace(path)
}

export default function MenuComponent() {
  return (
    <Menu id="main-layout-menu" theme="light" mode="inline" defaultSelectedKeys={["1", "1a"]}>
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
