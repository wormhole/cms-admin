import React, {Component} from "react";
import {Breadcrumb, Button, Input, message, Modal, Table} from "antd";
import {Link} from "react-router-dom";
import axios from "../../../util/axios";
import getUrl from "../../../util/url";
import api from "./api";

class Image extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.loadData();
    }

    handleTableSelected(selectedRowKeys) {
        this.props.save({selectedRowKeys: selectedRowKeys});
    }

    handleTableChange(pagination, filters, sorter) {
        let params = {
            limit: pagination.pageSize,
            page: pagination.current,
            sort: sorter.field ? sorter.field : null,
            order: sorter.order ? sorter.order.substring(0, sorter.order.length - 3) : null,
            key: this.props.image.params.key
        };
        this.loadData(params);
    };

    handleTableSearch(key) {
        let params = {
            page: 1,
            limit: 10,
            ...this.props.image.params,
            key: key
        };
        this.loadData(params);
    }

    handleTableSearchValueChange(e) {
        this.props.save({keyValue: e.target.value});
    }

    handleDelete(ids) {
        axios.delete(api.delete, {
            data: {
                ids: ids
            }
        }).then(result => {
            if (result.status) {
                message.success(result.message);
                let selectedRowKeys = this.props.image.selectedRowKeys;
                ids.map((item) => {
                    let index = selectedRowKeys.indexOf(item);
                    if (index > -1) {
                        selectedRowKeys.splice(index, 1);
                    }
                });
                this.props.save({selectedRowKeys: selectedRowKeys});
                let params = {
                    page: 1,
                    limit: 10,
                    ...this.props.image.params
                };
                this.loadData(params);
            } else {
                message.error(result.message);
            }
        }).catch(error => {

        });
    }

    handleShow(url) {
        this.props.save({url: url, show: true});
    }

    handleOk() {
        this.props.save({url: null, show: false});
    }

    handleCancel() {
        this.props.save({url: null, show: false});
    }

    loadData(params) {
        if (params) {
            this.props.save({
                loading: true,
                params: {sort: params.sort, order: params.order, key: params.key}
            });
        } else {
            params = {
                page: this.props.image.pagination.current,
                limit: this.props.image.pagination.pageSize,
                ...this.props.image.params
            }
        }
        axios.get(api.list, {
            params: {
                ...params
            }
        }).then(result => {
            if (result.status) {
                let pagination = {
                    current: params.page,
                    pageSize: params.limit,
                    total: result.data.total,
                };
                let dataSource = [];
                result.data.list.map((image) => {
                        dataSource.push({
                            ...image,
                            key: image.id
                        })
                    }
                );
                this.props.save({pagination: pagination, dataSource: dataSource, loading: false});
            } else {
                message.error(result.message);
            }
        }).catch(error => {

        });
    }

    render() {

        const columns = [{
                title: "时间",
                dataIndex: "ts",
                key: "ts",
                sorter: true,
                ellipsis: true
            }, {
                title: "用户名",
                dataIndex: "username",
                key: "username",
                ellipsis: true
            }, {
                title: "文件名",
                dataIndex: "name",
                key: "name",
                sorter: true,
                ellipsis: true
            }, {
                title: "路径",
                dataIndex: "absolutePath",
                key: "absolutePath",
                ellipsis: true
            }, {
                title: "缩略图",
                dataIndex: "path",
                key: "path",
                render: (path) => {
                    return <img style={{width: "80px", height: "40px"}}
                                className="cms-module-img"
                                onClick={this.handleShow.bind(this, getUrl(path))}
                                src={getUrl(path)}/>
                }
            }, {
                title: "操作项",
                fixed: "right",
                width: 250,
                render: (recorder) => {
                    return (
                        <div>
                            <a onClick={this.handleDelete.bind(this, [recorder.id])}
                               className="cms-module-danger">删除</a>
                        </div>
                    )
                }
            }]
        ;

        return (
            <div className="cms-module">
                <Breadcrumb className="cms-module-breadcrumb">
                    <Breadcrumb.Item><Link to="/dashboard" className="cms-module-link">首页</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>系统管理</Breadcrumb.Item>
                    <Breadcrumb.Item><Link to="/manage/image"
                                           className="cms-module-link">图片管理</Link></Breadcrumb.Item>
                </Breadcrumb>
                <div className="cms-module-content">
                    <div className="cms-module-head">
                        <Button type="danger" className="cms-module-button"
                                disabled={this.props.image.selectedRowKeys.length > 0 ? false : true}
                                onClick={this.handleDelete.bind(this, this.props.image.selectedRowKeys)}
                                ghost>删除</Button>
                        <Input.Search
                            placeholder="请输入关键字"
                            onSearch={this.handleTableSearch.bind(this)}
                            onChange={this.handleTableSearchValueChange.bind(this)}
                            value={this.props.image.keyValue}
                            className="cms-module-search"
                        />
                    </div>
                    <div className="cms-module-body">
                        <Table
                            className="cms-module-table"
                            rowSelection={{
                                selectedRowKeys: this.props.image.selectedRowKeys,
                                onChange: this.handleTableSelected.bind(this)
                            }}
                            columns={columns}
                            dataSource={this.props.image.dataSource}
                            pagination={this.props.image.pagination}
                            loading={this.props.image.loading}
                            onChange={this.handleTableChange.bind(this)}
                            scroll={{x: 1300}}
                            bordered
                        />
                    </div>
                </div>
                <Modal
                    title="图片展示"
                    visible={this.props.image.show}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    width={600}
                >
                    <img src={this.props.image.url} style={{"maxWidth": "550px"}}/>
                </Modal>
            </div>
        )
    }
}

export default Image;