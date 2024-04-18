import React, { lazy } from 'react';
import { Layout, Menu, theme } from 'antd';
import { useLoaderData } from 'react-router-dom'
import "./styles/main.layout.css"
import {
  UserOutlined,
  BookOutlined,
  TeamOutlined, 
  BankOutlined,
  DollarOutlined,
  ToolOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

const redirectPage = (path) => {
    window.location.replace(path)
}

const MainLayout = ({ pageContent }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: 'Đăng nhập',
      path: '/login'
    },
    {
      key: '2',
      icon: <BookOutlined />,
      label: 'Quản lý kho sách',
      submenu: [
        { key: '2a', label: 'Lập phiếu nhập sách', path: '/book/new' },
        { key: '2b', label: 'Tra cứu sách', path: '/book' },
        { key: '2c', label: 'Lập báo cáo hàng tháng tồn kho', path: '/book/report' },
      ],
    },
    {
      key: '3',
      icon: <TeamOutlined />,
      label: 'Quản lí khách hàng',
      submenu: [
        { key: '3a', label: 'Lập khách hàng mới', path: '/consumer/new' },
        { key: '3b', label: 'Tra cứu khách hàng', path: '/consumer' },
      ],
    },
    {
      key: '4',
      icon: <BankOutlined />,
      label: 'Quản lí dòng tiền',
      submenu: [
        { key: '4a', label: 'Lập hóa đơn bán sách', path: '/order/new' },
        { key: '4b', label: 'Lập phiếu thu tiền', path: 'payment/new' },
        { key: '4c', label: 'Lập báo cáo công nợ', path: 'payment/report' },
      ],
    },
    {
      key: '5',
      icon: <ToolOutlined />,
      label: 'Tùy chỉnh',
      path: '/setting'
    },
  ];

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#fff',
          opacity :2,
        }}
      >
      <div className="demo-logo-vertical" />
      <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
        {menuItems.map(item => (
          item.submenu ? (
            <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
              {item.submenu.map(subItem => (
                <Menu.Item key={subItem.key} onClick={() => redirectPage(subItem.path)}>{subItem.label}</Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            <Menu.Item key={item.key} icon={item.icon} onClick={() => redirectPage(item.path)}>
              {item.label}
            </Menu.Item>
            )
          ))}
        </Menu>
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: '24px 16px 0',
            overflow: 'initial',
          }}
        >
          <div
            style={{
              padding: 24,
              textAlign: 'center',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {pageContent}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Designed by teamUIT
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;