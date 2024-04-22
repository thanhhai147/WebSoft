import React, { lazy, useState } from 'react';
import { Layout, Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import "./styles/main.layout.css"

const { Content, Sider } = Layout;

const Header = lazy(() => import("../components/header.component"))
const Menu = lazy(() => import("../components/menu.component"))
const Footer = lazy(() => import("../components/footer.component"))

const MainLayout = ({ pageContent }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Header />
      <Content>
        <Layout>
          <Sider 
            id='main-layout-sider'
            trigger={null} 
            collapsible 
            collapsed={collapsed}
            width={250}
          >
            <div id='sider-title-wrapper' className='m-3 d-flex align-items-center justify-content-between'>
              {collapsed ? undefined : <h3 id='sider-title'>Danh mục</h3>} 
              <Button id='sider-collapsed-button' icon={collapsed ? <RightOutlined /> : <LeftOutlined />} onClick={() => setCollapsed(!collapsed)}></Button>
            </div>
            <Menu />
          </Sider>
          <Content className='p-4 pt-5'>
            {pageContent}
          </Content>
        </Layout>
      </Content>
      <Footer />
    </Layout>
  );
};

export default MainLayout;