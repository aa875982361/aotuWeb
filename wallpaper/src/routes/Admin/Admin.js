import React, { Component, Fragment } from 'react';
import { Form, Card, Table, Divider, Input, Button, Col } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Dialog from '../../components/Dialog/Dialog';
import Check from '../../components/Check/Check';

import styles from './Admin.less';

const FormItem = Form.Item;

const dataSource = [{
  key: '1',
  name: '胡彦斌',
}, {
  key: '2',
  name: '胡彦祖',
}];

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class Admin extends Component {
  // 初始化函数
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false, // 弹窗是否显示
      payload: {},
    };
    // 表格头
    this.columns = [{
      title: '账号',
      dataIndex: 'name',
      key: 'name',
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
          <Button type="danger" onClick={() => this.handleDialogVisible(true, record)} >删除</Button>
        </Fragment>
      ),
    }];
  }
  /**
   * 控制弹窗是否显示的函数
   * 第一个参数是新建 第二个参数是传进弹框的参数结构
   */
  handleDialogVisible = (flag, payloadVlue) => {
    console.log('handleDialogVisible', payloadVlue);
    this.setState({
      dialogVisible: !!flag, // 通过两个非将参数转换为bool型
      payload: payloadVlue ? { ...payloadVlue, title: '编辑' } : {},
    });
    this.props.form.setFieldsValue({
      desc: payloadVlue ? payloadVlue.key : '',
    });
  }
  /**
   * 查询的事件
   */
  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;
    console.log('handleSearch', form.getFieldValue('checkname'));
  }
  /**
   * 查询组件的表单
   */
  renderCheckFormItems() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Col md={8} sm={24}>
        <FormItem label="账号">
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
          label="账号"
        >
          {form.getFieldDecorator('username', {
            rules: [{ required: true, message: '请输入账号' }],
            initialValue: payload.name || '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="密码"
        >
          {form.getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码' }],
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
    const { loading } = this.props;
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
            dataSource={dataSource}
            columns={this.columns}
          />
        </Card>
        <Dialog
          visible={dialogVisible}
          handleDialogVisible={this.handleDialogVisible}
          payload={payload}
          formItems={this.renderDialogFormItem()}
        />
      </PageHeaderLayout>
    );
  }
}

