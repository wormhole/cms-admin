import React, {Component} from "react";
import {Breadcrumb, Button, Form, Input, message} from "antd";
import {Link} from "react-router-dom";
import axios from "../../../util/axios";

class Add extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (this.props.location.type === undefined) {
            this.props.history.push("/auth/user");
        }
    }

    componentWillUnmount() {
        this.handleClear();
    }

    handleClear() {
        this.props.save({
            edit: {
                id: null,
                username: null,
                email: null,
                telephone: null,
                newPassword: null,
                checkPassword: null
            }
        });
    }

    handleBack() {
        this.props.history.goBack();
    }

    handleSave() {
        if (this.props.location.type === "edit") {
            let param, api;
            if (this.props.location.content === "base") {
                param = {
                    id: this.props.user.edit.id,
                    username: this.props.user.edit.username,
                    email: this.props.user.edit.email,
                    telephone: this.props.user.edit.telephone,
                }
                api = "/auth/user/update";
            } else if (this.props.location.content === "password") {
                if (this.props.user.edit.newPassword !== this.props.user.edit.checkPassword) {
                    this.props.save({edit: {...this.props.user.edit, checkPassword: null}});
                    message.warning("两次密码不一致");
                    return;
                } else {
                    param = {
                        id: this.props.user.edit.id,
                        newPassword: this.props.user.edit.newPassword,
                        checkPassword: this.props.user.edit.checkPassword
                    }
                }
                api = "/auth/user/password";
            }
            axios.put(api, param).then(response => {
                if (response.data.status) {
                    message.success(response.data.message);
                } else {
                    message.error(response.data.message);
                }
            }).catch(error => {

            });
        } else if (this.props.location.type === "add") {
            axios.post("/auth/user/add", {
                username: this.props.user.edit.username,
                telephone: this.props.user.edit.telephone,
                email: this.props.user.edit.email,
                password: this.props.user.edit.newPassword
            }).then(response => {
                if (response.data.status === true) {
                    message.success(response.data.message);
                    this.handleClear();
                } else {
                    message.error(response.data.message);
                }
            }).catch(error => {

            });
        }
    }

    handleValueChange(key, e) {
        this.props.save({edit: {...this.props.user.edit, [key]: e.target.value}});
    }

    render() {
        return (

            <div className="cms-module">
                <Breadcrumb className="cms-module-breadcrumb">
                    <Breadcrumb.Item><Link to="/dashboard" className="cms-module-link">首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>认证与授权</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/auth/user"
                                           className="cms-module-link">用户管理</Link></Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/auth/user/add"
                                           className="cms-module-link">{this.props.location.type === "edit" ? "编辑" : "添加"}</Link></Breadcrumb.Item>
                </Breadcrumb>
                <div className="cms-module-content">
                    <div className="cms-module-head">
                        <Button type="primary" className="cms-module-back" onClick={this.handleBack.bind(this)}
                                ghost>返回</Button>
                        <Button type="primary" className="cms-module-button"
                                onClick={this.handleSave.bind(this)}>保存</Button>
                    </div>
                    <div className="cms-module-body">
                        <Form {...{
                            labelCol: {
                                xs: {span: 2},
                                sm: {span: 2}
                            },
                            wrapperCol: {
                                xs: {span: 8},
                                sm: {span: 8}
                            }
                        }} className="cms-module-form">
                            {this.props.location.content !== "password" ?
                                <div>
                                    <Form.Item label="用户名" className="cms-module-item">
                                        <Input type="text" className="cms-module-input" placeholder="请输入用户名"
                                               value={this.props.user.edit.username}
                                               onChange={this.handleValueChange.bind(this, "username")}/>
                                    </Form.Item>
                                    <Form.Item label="邮箱" className="cms-module-item">
                                        <Input type="email" className="cms-module-input" placeholder="请输入邮箱"
                                               value={this.props.user.edit.email}
                                               onChange={this.handleValueChange.bind(this, "email")}/>
                                    </Form.Item>
                                    <Form.Item label="电话号码" className="cms-module-item">
                                        <Input type="telephone" className="cms-module-input" placeholder="请输入电话号码"
                                               value={this.props.user.edit.telephone}
                                               onChange={this.handleValueChange.bind(this, "telephone")}/>
                                    </Form.Item>
                                </div> : null}
                            {this.props.location.content !== "base" ?
                                <div>
                                    <Form.Item label="密码" className="cms-module-item">
                                        <Input.Password className="cms-module-input" placeholder="请输入密码"
                                                        value={this.props.user.edit.newPassword}
                                                        onChange={this.handleValueChange.bind(this, "newPassword")}/>
                                    </Form.Item>
                                    <Form.Item label="确认密码" className="cms-module-item">
                                        <Input.Password className="cms-module-input" placeholder="请确认密码"
                                                        value={this.props.user.edit.checkPassword}
                                                        onChange={this.handleValueChange.bind(this, "checkPassword")}/>
                                    </Form.Item>
                                </div> : null}
                        </Form>
                    </div>
                </div>
            </div>
        )

    }
}

export default Add;