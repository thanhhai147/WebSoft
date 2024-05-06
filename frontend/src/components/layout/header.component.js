import React, { lazy, useContext } from 'react';
import UserContext from '../../contexts/user.context'; 
import { Layout , Avatar, Popover } from 'antd';
import TokenUtil from "../../helpers/token.utils";
import LoginAPI from "../../api/login.api";
import "./styles/header.component.css";
import Logo from './assets/bookstore.png'

const Button = lazy(() => import("../common/button.component"))

const { Header } = Layout;

const handleLogout = async () => {
    try {
        await LoginAPI.handleLogout();
        TokenUtil.removeToken();
        TokenUtil.removeUsername();
        window.location.assign("/login");
    } catch (error) {
        console.error("Error logging out: ", error);
    }
};

export default function HeaderComponent() {
    const { token, username } = useContext(UserContext) 

    const Logout = (
        <div id='logout-wrapper' className='d-flex flex-column'>
            <p className='d-flex mb-4 mt-2'><span>{username}</span>, Bạn có muốn đăng xuất?</p>
            <Button buttonCase="logout" id="logout-button" onClick={handleLogout} />
        </div>
    )

    return (
        <Header id='header' className='d-flex flex-row align-items-center'>
            <div id='web-title' className='d-flex flex-row align-items-center'>
                <div id='logo-wrapper'>
                    <img id='logo' src={Logo} alt='Logo' />
                </div>
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