import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import LoginAPI from  "../api/login.api";
import TokenUtil from '../helpers/token.utils';

export default function Login () {

    const onFinish = async (values) => {
        try {
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
                    <Form
                        name="basic"
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        style={{
                            maxWidth: 600,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                required: true,
                                message: 'Please input your username!',
                                },
                            ]}
                        >
                            <Input/>
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                required: true,
                                message: 'Please input your password!',
                                },
                            ]}
                        >
                            <Input.Password/>
                        </Form.Item>

                        <Form.Item
                            wrapperCol={{
                                offset: 8,
                                span: 16,
                            }}
                        >
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
}
