import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Alert, Space } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
const bcrypt = require("bcryptjs");

function Login() {
  const [form] = Form.useForm();
  const [emailTest, setEmailTest] = useState(false);
  const [passwordTest, setPasswordTest] = useState(false);
  const [invalidCredentials, setInvalidCredentials] = useState(false);

  const validateEmail = (rule, value) => {
    if (value && !/^\S+@\S+\.\S+$/.test(value)) {
      return Promise.reject("Invalid email address");
    } else {
      return Promise.resolve();
    }
  };

  const validatePassword = (rule, value) => {
    if (value && value.length < 5) {
      return Promise.reject("Password is too short");
    } else {
      return Promise.resolve();
    }
  };

  const handleSubmit = (values) => {
    try {
      axios
        .get(`http://localhost:3000/api/user/getUser`, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
        .then((res) => {
          console.log(res);
          if (
            res.data.length === 0 ||
            !bcrypt.compare(values.password, res.data.password)
          ) {
            setInvalidCredentials(true);
          } else {
            localStorage.setItem("user", JSON.stringify(res.data));
            window.location.href = "/";
          }
        })
        .catch((error) => {
          setInvalidCredentials(true);
        });
    } catch (error) {
      setInvalidCredentials(true);
    }
  };

  return (
    <div className="form-log">
      <Form
        form={form}
        name="login"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email",
            },
            {
              validator: validateEmail,
            },
          ]}
        >
          <Input style={{ height: "30px" }} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password",
            },
            {
              validator: validatePassword,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            className="submit-button"
            type="primary"
            htmlType="submit"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            Submit
          </Button>
        </Form.Item>

        {emailTest && (
          <Alert message="Invalid email address" type="error" showIcon />
        )}

        {passwordTest && (
          <Alert message="Password is too short" type="error" showIcon />
        )}

        {invalidCredentials && (
          <Alert message="Invalid email or password" type="error" showIcon />
        )}
        <Link to="/SignUp">i don't have an account</Link>
      </Form>
    </div>
  );
}

export default Login;
