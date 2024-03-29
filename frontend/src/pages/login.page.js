import React from "react"
import LoginAPI from "../api/login.api"
import { Button, Form, Input } from 'antd';
import TokenUtil from "../helpers/token.utils";


const LoginPage = ({setToken, setUsername}) => {
    // const [username, setUsername] = useState("");
    // const [password, setPassword] = useState("");

    const onFinish = async (values) => {
        console.log('Success:', values);
        try {
            let response = await LoginAPI.handleLogin(values)
            if(response.status === 200) {
                console.log(response)
                let token = response.data.data.token
                let username = response.data.data.username
                TokenUtil.saveToken(token)
                setToken(token)
                setUsername(username)
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
                <Input />
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
                <Input.Password />
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
    );
};

export default LoginPage;
