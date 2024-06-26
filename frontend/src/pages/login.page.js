import React, { lazy } from "react";
import { Form, Input } from "antd";
import LoginAPI from "../api/login.api";
import TokenUtil from "../helpers/token.utils";
import { NotificationComponent } from "../components/common/notification.component";
import { TITLE, MESSAGE } from "../messages/main.message";
import "./styles/login.page.css";

const Button = lazy(() => import("../components/common/button.component"));

export default function Login() {
  const onFinish = async (values) => {
    try {
      let response = await LoginAPI.handleLogin({
        username: values.username,
        password: values.password,
      });

      if (response.success) {
        TokenUtil.saveToken(response.data.token);
        TokenUtil.saveUsername(response.data.account);
        TokenUtil.saveRole(response.data.role);

        NotificationComponent(
          "success",
          TITLE.SUCCESS,
          MESSAGE.SIGN_IN_SUCCESS
        );

        window.location.assign("/");
      }
    } catch (err) {
      console.log(err);
      NotificationComponent("error", TITLE.ERROR, MESSAGE.HAS_AN_ERROR);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    NotificationComponent("warning", TITLE.WARNING, MESSAGE.HAS_AN_ERROR);
  };

  return (
    <>
      <div
        className={
          "container-fluid full-screen d-flex justify-content-center align-items-center"
        }
      >
        <div
          id="login-form"
          className={
            "row d-flex flex-column align-items-center justify-content-center p-5"
          }
        >
          <h1 className="mb-5">Đăng Nhập</h1>
          <Form
            name="basic"
            layout="vertical"
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
                  message: "Vui lòng nhập tên tài khoản!",
                },
              ]}
            >
              <Input id="username-input" placeholder="Nhập tên tài khoản" />
            </Form.Item>

            <Form.Item
              label={<span>Mật khẩu</span>}
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button
                buttonCase="login"
                id="login-btn"
                htmlType="submit"
                block
              />
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}
