import React, {Component} from "react";
import {Button, Col, Form, Input, message, Row} from "antd";
import {LockOutlined, SafetyCertificateOutlined, UserOutlined} from "@ant-design/icons";
import "./login.less";
import axios from "../../util/axios";
import {Link} from "react-router-dom";
import getUrl from "../../util/url";

class Login extends Component {
    constructor(props) {
        super(props);
    }

    componentWillUnmount() {
        this.handleClear();
    }

    handleClear() {
        this.props.save({
            username: null,
            password: null,
            code: null,
            codeApi: getUrl("/code?" + Math.random())
        });
    }

    handleSubmit() {
        let param = new FormData();
        param.append("username", this.props.login.username);
        param.append("password", this.props.login.password);
        param.append("code", this.props.login.code);
        axios.post("/login", param, {headers: {"Content-Type": "multipart/form-data"},}).then(response => {
            if (response.data.status === true) {
                message.success(response.data.message);
                localStorage.setItem("token", response.data.data);
                this.props.history.push("/");
            } else {
                message.error(response.data.message);
                this.props.save({codeApi: getUrl("/code?" + Math.random())})
            }
        }).catch(error => {

        });
    };

    handleValueChange(key, e) {
        this.props.save({[key]: e.target.value});
    }

    handleVCodeChange() {
        this.props.save({codeApi: getUrl("/code?" + Math.random())});
    }

    render() {
        return (
            <div className="cms-login">
                <div className="cms-login-outer">
                    <h3>用户登录</h3>
                    <div className="cms-login-inner">
                        <Form onFinish={this.handleSubmit.bind(this)} className="cms-login-form">
                            <Form.Item>
                                <Input
                                    prefix={<UserOutlined className="cms-login-icon"/>}
                                    placeholder="用户名"
                                    className="cms-login-input"
                                    value={this.props.login.username}
                                    onChange={this.handleValueChange.bind(this, "username")}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Input.Password
                                    prefix={<LockOutlined className="cms-login-icon"/>}
                                    type="password"
                                    placeholder="密码"
                                    className="cms-login-input"
                                    value={this.props.login.password}
                                    autoComplete="off"
                                    onChange={this.handleValueChange.bind(this, "password")}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Row gutter={8}>
                                    <Col span={14}>
                                        <Input
                                            prefix={<SafetyCertificateOutlined className="cms-login-icon"/>}
                                            type="text"
                                            placeholder="验证码"
                                            className="cms-login-input"
                                            value={this.props.login.code}
                                            onChange={this.handleValueChange.bind(this, "code")}
                                        />
                                    </Col>
                                    <Col span={10}>
                                        <img src={this.props.login.codeApi} className="cms-login-img"
                                             id="verify-img" onClick={this.handleVCodeChange.bind(this)}/>
                                    </Col>
                                </Row>
                            </Form.Item>
                            <Button type="primary" htmlType="submit" className="cms-login-button">
                                登录
                            </Button>
                        </Form>
                        <Link to="/register">注册用户</Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;