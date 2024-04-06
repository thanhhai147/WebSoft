import React from "react";
import LoginAPI from "../api/login.api";
import { Button } from 'antd';
import TokenUtil from "../helpers/token.utils";

export default function Logout() {
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

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Button type="primary" onClick={handleLogout} className="Button">Đăng xuất</Button>
        </div>
    );
}
