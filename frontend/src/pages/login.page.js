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
            <div className={"container-fluid full-screen d-flex justify-content-center align-items-center"}>
                <div id='login-form' className={"row d-flex flex-column align-items-center justify-content-center p-5"}>
                    <h1 className='mb-5'>Đăng Nhập</h1>
                    <Form
                        name="basic"
                        layout='vertical'
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        requiredMark={false}
                        scrollToFirstError={true}
                    >
                        <Form.Item
                            label={<span>Tài khoản</span>}
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên tài khoản!',
                                },
                            ]}
                        >
                            <Input id='username-input' placeholder='Nhập tên tài khoản'/>
                        </Form.Item>
                        
                        <Form.Item
                            label={<span >Mật khẩu</span>}
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mật khẩu!',
                                },
                            ]}
                        >
                            <Input.Password placeholder='Nhập mật khẩu'/>
                        </Form.Item>
                
                        <Form.Item
                        >
                            <Button id='login-btn' type="primary" htmlType="submit" block >
                                Xác nhận
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
}
