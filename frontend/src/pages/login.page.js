import React from 'react';
import { Button, Form, Input } from 'antd';
import LoginAPI from  "../api/login.api";
import TokenUtil from '../helpers/token.utils';
import "./styles/login.page.css";


export default function Login () {

    const onFinish = async (values) => {
        try {
            console.log(values.username)
            let response = await LoginAPI.handleLogin({
                "username": values.username,
                "password": values.password
            })
            if(response.success) {
                TokenUtil.saveToken(response.data.token)
                TokenUtil.saveUsername(response.data.account)
                window.location.replace("/book")
            }
        } catch (err) {
            console.log(err)
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };    

    return (
        <>
            <div className={"container-fluid full-screen"}>
                <div className={"row align-items-center justify-content-center"}>
                    <h4>Đăng Nhập</h4>
                    <Form
                        name="basic"
                        layout='vertical'
                        style={{
                            maxWidth:500,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                        label={<span>Tên đăng nhập</span>}
                        name="username"
                        rules={[
                            {
                            message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    
                    <Form.Item
                        label={<span >Mật khẩu</span>}
                        name="password"
                        rules={[
                            {
                            message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password/>
                    </Form.Item>
                
                        <Form.Item
                        >
                            <Button type="primary" htmlType="submit" block >
                                Đăng nhập
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
}
