import React, {Component} from "react";
import {Avatar, Card, Col, message, Row} from "antd";
import {Bar, Pie} from "@antv/g2plot";
import {FileOutlined, IdcardOutlined, MenuOutlined, TeamOutlined} from "@ant-design/icons";
import axios from "../../util/axios";
import {Link} from "react-router-dom";
import api from "./api";

class DashBoard extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadCount();
        this.loadUserStatus(this.initUserStatusChart);
        this.loadTopIp(this.initTopIpChart);
    }

    componentWillUnmount() {
        this.props.save({memPlot: null});
    }

    initMemChart() {
        let data = [];
        data.push({type: "已使用", value: this.props.dashboard.mem.used});
        data.push({type: "未使用", value: this.props.dashboard.mem.free});
        this.props.save({memData: data});

        if (!this.props.dashboard.memPlot) {
            let memPlot = new Pie(document.getElementById("mem"), {
                forceFit: true,
                radius: 0.8,
                data: data,
                angleField: "value",
                colorField: "type",
                label: {
                    visible: true,
                    type: "spider",
                },
            });
            this.props.save({memPlot: memPlot});
            this.props.dashboard.memPlot.render();
        }
    }

    initTopIpChart(topIp) {
        let data = [];
        for (var key in topIp) {
            data.push({地址: key, 数量: topIp[key]});
        }

        const barPlot = new Bar(document.getElementById("ip"), {
            forceFit: true,
            data: data,
            xField: "数量",
            yField: "地址",
            label: {
                visible: true,
                formatter: (v) => v + "次",
            }
        });

        barPlot.render();
    }

    initUserStatusChart(userStatus) {
        let data = [];
        data.push({状态: "总数", 数量: userStatus.total});
        data.push({状态: "启用", 数量: userStatus.enable});
        data.push({状态: "在线", 数量: userStatus.online});
        data.push({状态: "禁用", 数量: userStatus.disable});
        data.push({状态: "锁定", 数量: userStatus.lock});

        const barPlot = new Bar(document.getElementById("user"), {
            forceFit: true,
            data: data,
            xField: "数量",
            yField: "状态",
            label: {
                visible: true,
                formatter: (v) => v + "人",
            }
        });

        barPlot.render();
    }

    loadCount() {
        axios.get(api.count).then(result => {
            if (result.status) {
                this.props.save({count: result.data});
            } else {
                message.error(result.message);
            }
        }).catch(error => {

        });
    }

    loadUserStatus(callback) {
        axios.get(api.userStatus).then(result => {
            if (result.status) {
                callback(result.data);
            } else {
                message.error(result.message);
            }
        }).catch(error => {

        });
    }

    loadTopIp(callback) {
        axios.get(api.topIp).then(result => {
            if (result.status) {
                callback(result.data);
            } else {
                message.error(result.message);
            }
        }).catch(error => {

        });
    }

    render() {
        return (
            <div className="cms-module">
                <div className="cms-module-dashboard">
                    <Row gutter={32} className="cms-module-row">
                        <Col span={6}>
                            <Card className="cms-module-card">
                                <Card.Meta
                                    avatar={<Avatar size={90} icon={<TeamOutlined/>}
                                                    style={{backgroundColor: "#E77474"}}/>}
                                    title="用户数量"
                                    description={<Link to="#">{this.props.dashboard.count.user}</Link>}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="cms-module-card">
                                <Card.Meta
                                    avatar={<Avatar size={90} icon={<IdcardOutlined/>}
                                                    style={{backgroundColor: "#F5D05B"}}/>}
                                    title="角色数量"
                                    description={<Link to="#">{this.props.dashboard.count.role}</Link>}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="cms-module-card">
                                <Card.Meta
                                    avatar={<Avatar size={90} icon={<MenuOutlined/>}
                                                    style={{backgroundColor: "#FB9D62"}}/>}
                                    title="菜单数量"
                                    description={<Link to="#">{this.props.dashboard.count.menu}</Link>}
                                />
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card className="cms-module-card">
                                <Card.Meta
                                    avatar={<Avatar size={90} icon={<FileOutlined/>}
                                                    style={{backgroundColor: "#70BFEF"}}/>}
                                    title="文件数量"
                                    description={<Link to="#">{this.props.dashboard.count.file}</Link>}
                                />
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={32} className="cms-module-row">
                        <Col span={8}>
                            <Card title="登录ip排行" className="cms-module-card">
                                <div id="ip" className="cms-module-chart"/>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="内存监控(单位：GB)" className="cms-module-card">
                                <div id="mem" className="cms-module-chart"/>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="用户状态统计" className="cms-module-card">
                                <div id="user" className="cms-module-chart"/>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default DashBoard;