import React, { useContext } from 'react';
import { UserContext } from '../routers'; 
import { Layout , Avatar, Popover, Button } from 'antd';
import { LogoutOutlined  } from '@ant-design/icons';
import TokenUtil from "../helpers/token.utils";
import LoginAPI from "../api/login.api";
import "./styles/header.component.css";

const { Header, Content } = Layout;

const handleLogout = async () => {
    try {
        await LoginAPI.handleLogout();
        TokenUtil.removeToken();
        TokenUtil.removeUsername();
        window.location.replace("/login");
    } catch (error) {
        console.error("Error logging out: ", error);
    }
};

export default function HeaderComponent() {
    const { token, username } = useContext(UserContext) 

    const Logout = (
        <div id='logout-wrapper' className='d-flex flex-column'>
            <p className='d-flex mb-4 mt-2'><h3>{username}</h3>, Bạn có muốn đăng xuất?</p>
            <Button id="logout-button" type="primary" onClick={handleLogout} className="Button" icon={<LogoutOutlined />}>Đăng xuất</Button>
        </div>
    )

    return (
        <Header id='header' className='d-flex flex-row align-items-center'>
            <div id='web-title'>
                <h1>Quản lí nhà sách</h1>
            </div>

            <div id='avatar-wrapper'>
                <Popover placement='bottom' trigger='click' content={Logout}>
                    <Avatar
                        id='avatar'
                        size={{
                            xs: 8,
                            sm: 12,
                            md: 16,
                            lg: 28,
                            xl: 36,
                            xxl: 46,
                        }}
                        shape='circle'
                    >
                        <h2 id='avatar-letter'>{username[0].toUpperCase()}</h2>
                    </Avatar>
                </Popover>
            </div>
        </Header>
    )
}