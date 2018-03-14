import React, { Component, Fragment } from 'react';
import { Form, Card, Table, Divider, Input, Button, Col } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Dialog from '../../components/Dialog/Dialog';
import Check from '../../components/Check/Check';

import styles from './LiuhaiSeries.less';

const FormItem = Form.Item;

@connect(({ liuhaiSeries }) => ({
  liuhaiSeries,
}))
@Form.create()
export default class LiuhaiSeries extends Component {
  // 初始化函数
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false, // 弹窗是否显示
      payload: {},
    };
    this.props.dispatch({
      type: 'liuhaiSeries/getlist',
      payload: {},
    });
    // 表格头
    this.columns = [{
      title: '刘海模板系列ID',
      dataIndex: 'liuhaiSeriesId',
      key: 'liuhaiSeriesId',
    }, {
      title: '系列名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '免费',
      dataIndex: 'free',
      key: 'free',
      render: val => <span>{val ? '是' : '否'}</span>,
    }, {
      title: '操作',
      dataIndex: 'op',
      fixed: 'right',
      width: 200,
      key: 'op',
      render: (text, record) => (
        <Fragment>
          <Button type="ghost" onClick={() => this.handleDialogVisible(true, record)} >编辑</Button>
          <Divider type="vertical" />
          <Button type="danger" onClick={() => this.handleDelete(record)} >删除</Button>
        </Fragment>
      ),
    }];
  }
  /**
   * 弹窗的回调函数
   */
  handleDelete = (payload) => {
    console.log('handleAdd', payload);
    this.props.dispatch({
      type: 'admin/addManager',
      payload: {
        method: 'DELETE',
        managerId: payload.managerId,
      },
    });
  }
  /**
   * 删除管理员的回调
   */
  handleAdd = () => {
    const { form } = this.props;
    const { payload } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;// 重置 Checkbox 的勾选状态
      console.log('handleAdd', fieldsValue, payload);
      this.props.dispatch({
        type: 'admin/addManager',
        payload: {
          account: fieldsValue.account,
          method: payload.managerId ? 'PUT' : 'POST',
          password: fieldsValue.password,
          roleType: 'ADMIN',
          managerId: payload.managerId,
          createTime: payload.createTime,
        },
      });
    });
    this.handleDialogVisible(false);
  }
  /**
   * 控制弹窗是否显示的函数
   * 第一个参数是新建 第二个参数是传进弹框的参数结构
   */
  handleDialogVisible = (flag, payloadVlue) => {
    this.props.form.setFieldsValue({
      account: payloadVlue ? payloadVlue.account : '',
      password: '',
    });
    console.log('handleDialogVisible', payloadVlue);
    this.setState({
      dialogVisible: !!flag, // 通过两个非将参数转换为bool型
      payload: payloadVlue ? {
        ...payloadVlue,
        title: '编辑',
        managerId: payloadVlue ? payloadVlue.managerId : '',
        createTime: payloadVlue ? payloadVlue.createTime : '',
      } : {},
    });
  }
  /**
   * 查询的事件
   */
  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    console.log('handleSearch', form.getFieldValue('checkname'));
    const data = '&name='.concat(form.getFieldValue('checkname'));
    this.props.dispatch({
      type: 'admin/getlist',
      payload: {
        data,
      },
    });
  }
  /**
   * 查询组件的表单
   */
  renderCheckFormItems() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Col md={8} sm={24}>
        <FormItem label="系列名称">
          {getFieldDecorator('checkname')(
            <Input placeholder="请输入查找的账号" />
          )}
        </FormItem>
      </Col>
    );
  }
  /**
   * 弹窗组件的表单
   */
  renderDialogFormItem() {
    const { payload } = this.state;
    const { form } = this.props;
    return (
      <div>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="系列名称"
        >
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入系列名称' }],
            initialValue: payload.name || '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="免费"
        >
          {form.getFieldDecorator('password', {
            rules: [{ required: true, message: '请选择' }],
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
      </div>
    );
  }
  // 主页面
  render() {
    const { dialogVisible, payload } = this.state;
    const { liuhaiSeries, loading } = this.props;
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div >
            <Check formItems={this.renderCheckFormItems()} handleSearch={this.handleSearch} />
          </div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => this.handleDialogVisible(true)}>
                新建
            </Button>
          </div>
          <Table
            loading={loading}
            dataSource={liuhaiSeries.dataSource}
            columns={this.columns}
          />
        </Card>
        <Dialog
          visible={dialogVisible}
          handleDialogVisible={this.handleDialogVisible}
          payload={payload}
          formItems={this.renderDialogFormItem()}
          handleAdd={this.handleAdd}
        />
      </PageHeaderLayout>
    );
  }
}

