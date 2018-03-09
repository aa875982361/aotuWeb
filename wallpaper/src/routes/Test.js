// import { Link } from 'dva/router';
// import Exception from '../../components/Exception';
import React, { PureComponent, Fragment } from 'react';
import { Form, Input, Button, Row, Col, Table } from 'antd';
import { connect } from 'dva';
// import { MyTable } from './Table';

import styles from './Test.less';
import Dialog from './Share/Dialog';

const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号',
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号',
}];

const FormItem = Form.Item;

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class TableTest extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      payload: {},
    };
    this.columns = [{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    }, {
      title: '操作',
      dataIndex: 'op',
      fixed: 'right',
      key: 'op',
      width: 100,
      render: (text, record) => (
        <Fragment>
          <Button onClick={() => this.handleModalEdit(true, record)} >增加</Button>
        </Fragment>
      ),
    }];
  }

  /**
   * 新建弹窗的回调函数
   */
  handleAdd = () => {
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();// 重置 Checkbox 的勾选状态
      console.log('okHandle', fieldsValue);
    });
  }
  /**
   * 设置弹窗的显示状态
   */
  handleModalVisible = (flag) => {
    this.setState({
      payload: { title: '新建规则' },
      modalVisible: !!flag, // !!确定转换为布尔类型
    });
  }
  /**
   * 设置弹窗的显示状态
   */
  handleModalEdit = (flag, record) => {
    console.log('handleModalEdit', record);
    this.setState({
      payload: {
        ...record,
        title: '编辑',
      },
      modalVisible: !!flag, // !!确定转换为布尔类型
    });
  }
  /**
   * 查询的事件
   */
  handleSearch = (e) => {
    e.preventDefault();
    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      console.log('handleSearch', values);
    });
  }
  /**
   * 弹窗内的组件
   */
  renderFormItem() {
    const { payload } = this.state;
    const { form } = this.props;
    return (
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="描述"
      >
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please input some description...' }],
          initialValue: payload.key,
        })(
          <Input placeholder="请输入" />
        )}
      </FormItem>
    );
  }
  /**
   * 查询组件
  */
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="姓名">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" >查询</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  // 主页面
  render() {
    const { modalVisible, payload } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <div>
        <div>pling</div>
        <div className={styles.tableListForm}>
          {this.renderSimpleForm()}
        </div>
        <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
        新建
        </Button>
        <Dialog
          {...parentMethods}
          modalVisible={modalVisible}
          payload={payload}
          formItems={this.renderFormItem()}
        />
        <Table dataSource={dataSource} columns={this.columns} />
      </div>
    );
  }
}
