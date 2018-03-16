import React, { Component, Fragment } from 'react';
import { Form, Card, Table, Divider, Input, Button, Col, Select } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Dialog from '../../components/Dialog/Dialog';
import Check from '../../components/Check/Check';

import styles from './Liuhai.less';
import PicturesWall from '../../components/PicturesWall/PicturesWall';
import { CONFIG } from '../../common/config';

const FormItem = Form.Item;
const { Option } = Select;

/**
 * 表单配置 包括表格标题，宽度，id属性
 */
const FormConfig = {
  title: {
    createTime: '创建时间',
    free: '免费',
    iconPath: '刘海icon',
    iphone5Path: '刘海(iphone5)',
    liuhaiId: '刘海ID',
    liuhaiSeriesName: '系列名称',
    name: '刘海名称',
    notIPhone5Path: '刘海(非iphone5)',
    weights: '权重',
    operation: '操作',
  },
  width: {
    createTime: 100,
    free: 200,
    iconPath: 200,
    iphone5Path: 200,
    liuhaiId: 100,
    liuhaiSeriesName: 200,
    name: 200,
    notIPhone5Path: 200,
    weights: 100,
    operation: 200,
    maxwidth: 1300,
  },
  createTime: 'createTime',
  free: 'free',
  iconPath: 'iconPath',
  iphone5Path: 'iphone5Path',
  liuhaiId: 'liuhaiId',
  liuhaiSeriesName: 'liuhaiSeriesName',
  liuhaiSeriesId: 'liuhaiSeriesId',
  name: 'name',
  notIPhone5Path: 'notIPhone5Path',
  weights: 'weights',
  operation: 'operation',
  checkname: 'checkname',
  checkLabel: '刘海名称',
  dialogTitle: '编辑',
};

@connect(({ liuhai }) => ({
  liuhai,
}))
@Form.create()
/**
 * 刘海页面 需要导入liuhai Models
 */
export default class Liuhai extends Component {
  // 初始化函数
  constructor(props) {
    super(props);
    this.state = {
      dialogVisible: false, // 弹窗是否显示
      payload: {},
    };
    /**
     * 初始化数据
     */
    this.props.dispatch({
      type: 'liuhai/getSeriesList',
      payload: {},
    });
    this.props.dispatch({
      type: 'liuhai/getlist',
      payload: {},
    });
    // 表格头
    this.columns = [{
      title: FormConfig.title.name,
      dataIndex: FormConfig.name,
      key: FormConfig.name,
      width: FormConfig.width.name,
    }, {
      title: FormConfig.title.liuhaiSeriesName,
      dataIndex: FormConfig.liuhaiSeriesName,
      key: FormConfig.liuhaiSeriesName,
      width: FormConfig.width.liuhaiSeriesName,
    }, {
      title: FormConfig.title.weights,
      dataIndex: FormConfig.weights,
      key: FormConfig.weights,
      width: FormConfig.width.weights,
    }, {
      title: FormConfig.title.free,
      dataIndex: FormConfig.free,
      key: FormConfig.free,
      width: FormConfig.width.free,
      render: (val) => {
        return <span>{ val ? '是' : '否'}</span>;
      },
    }, {
      title: FormConfig.title.iconPath,
      dataIndex: FormConfig.iconPath,
      key: FormConfig.iconPath,
      width: FormConfig.width.iconPath,
      render: (val) => {
        return <img alt="example" style={{ width: '128px', height: '100px' }} src={val} />;
      },
    }, {
      title: FormConfig.title.iphone5Path,
      dataIndex: FormConfig.iphone5Path,
      key: FormConfig.iphone5Path,
      width: FormConfig.width.iphone5Path,
      render: (val) => {
        return <img alt="example" style={{ width: '128px', height: '100px' }} src={val} />;
      },
    }, {
      title: FormConfig.title.notIPhone5Path,
      dataIndex: FormConfig.notIPhone5Path,
      key: FormConfig.notIPhone5Path,
      width: FormConfig.width.notIPhone5Path,
      render: (val) => {
        return <img alt="example" style={{ width: '128px', height: '100px' }} src={val} />;
      },
    }, {
      title: FormConfig.title.operation,
      dataIndex: FormConfig.operation,
      key: FormConfig.operation,
      fixed: 'right',
      width: FormConfig.width.operation,
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
   * 删除的回调
   */
  handleDelete = (payload) => {
    console.log('handleDelete', payload);
    this.props.dispatch({
      type: 'liuhai/addLiuhai',
      payload: {
        method: 'DELETE',
        items: ''.concat('?liuhaiId=', payload.liuhaiId),
      },
    });
  }
  /**
   * 弹窗的回调函数
   */
  handleAdd = () => {
    const { form, dispatch } = this.props;
    const { payload } = this.state;
    form.validateFields((err, fieldsValue) => {
      console.log('handleAdd', fieldsValue, payload);
      dispatch({
        type: 'liuhai/addLiuhai',
        payload: {
          ...fieldsValue,
          ...payload,
          free: !!fieldsValue.free,
          weights: parseInt(fieldsValue.weights, 0),
        },
      });
    });
    this.handleDialogVisible(false);
  }
  /**
   * 图片上传成功回调
   * @param {*} res 返回的参数
   */
  handleResponse = (res) => {
    const { payload } = this.state;
    console.log('handleResponse', res);
    switch (res.name) {
      case FormConfig.iconPath:
        this.setState({
          payload: {
            ...payload,
            iconPath: CONFIG.imgHost.concat('/', res.key),
          },
        });
        break;
      case FormConfig.iphone5Path:
        this.setState({
          payload: {
            ...payload,
            iphone5Path: CONFIG.imgHost.concat('/', res.key),
          },
        });
        break;
      case FormConfig.notIPhone5Path:
        this.setState({
          payload: {
            ...payload,
            notIPhone5Path: CONFIG.imgHost.concat('/', res.key),
          },
        });
        break;
      default:
        console.log('handleResponse', res.name);
        break;
    }
  }

  /**
   * 控制弹窗是否显示的函数
   * 第一个参数是新建 第二个参数是传进弹框的参数结构
   */
  handleDialogVisible = (flag, payloadVlue) => {
    console.log('handleDialogVisible', payloadVlue);
    this.props.form.setFieldsValue({
      name: payloadVlue ? payloadVlue.name : '',
      liuhaiSeriesId: payloadVlue ? payloadVlue.liuhaiSeriesId : '',
      weights: payloadVlue ? payloadVlue.weights : '',
      free: payloadVlue && payloadVlue.free ? 'yes' : '',
    });
    this.setState({
      dialogVisible: !!flag, // 通过两个非将参数转换为bool型
      payload: payloadVlue ? {
        ...payloadVlue,
        title: FormConfig.dialogTitle,
        iconPath: payloadVlue ? payloadVlue.iconPath : '',
        iphone5Path: payloadVlue ? payloadVlue.iphone5Path : '',
        notIPhone5Path: payloadVlue ? payloadVlue.notIPhone5Path : '',
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
      type: 'liuhai/getlist',
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
        <FormItem label={FormConfig.checkLabel}>
          {getFieldDecorator(FormConfig.checkname)(
            <Input placeholder="请输入" />
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
    const { form, liuhai } = this.props;
    return (
      <div>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label={FormConfig.title.name}
        >
          {form.getFieldDecorator(FormConfig.name, {
            rules: [{ required: true, message: '请输入' }],
            initialValue: payload.name || '',
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label={FormConfig.title.liuhaiSeriesName}
        >
          {form.getFieldDecorator(FormConfig.liuhaiSeriesId, {
            rules: [{ required: true, message: '请选择' }],
          })(
            <Select
              style={{ width: 120 }}
              placeholder="请选择"
              dropdownMatchSelectWidth
            >
              {
                liuhai.seriesList && liuhai.seriesList.map((value) => {
                  return (
                    <Option
                      key={value.liuhaiSeriesId}
                      value={value.liuhaiSeriesId}
                    >
                      {value.name}
                    </Option>
                  );
                })
              }
            </Select>
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label={FormConfig.title.iconPath}
        >
          {form.getFieldDecorator(FormConfig.iconPath, {
            rules: [{ message: '' }],
          })(
            <PicturesWall handleResponse={this.handleResponse} name={FormConfig.iconPath} />
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label={FormConfig.title.notIPhone5Path}
        >
          {form.getFieldDecorator(FormConfig.notIPhone5Path, {
            rules: [{ message: '' }],
          })(
            <PicturesWall handleResponse={this.handleResponse} name={FormConfig.notIPhone5Path} />
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label={FormConfig.title.iphone5Path}
        >
          {form.getFieldDecorator(FormConfig.iphone5Path, {
            rules: [{ message: '' }],
          })(
            <PicturesWall handleResponse={this.handleResponse} name={FormConfig.iphone5Path} />
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label={FormConfig.title.free}
        >
          {form.getFieldDecorator(FormConfig.free, {
            rules: [{ required: true, message: '请选择' }],
            initialValue: 'yes',
          })(
            <Select
              style={{ width: 120 }}
              placeholder="请选择"
              dropdownMatchSelectWidth
            >
              <Option value="yes" >是</Option>
              <Option value="">否</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label={FormConfig.title.weights}
        >
          {form.getFieldDecorator(FormConfig.weights, {
            rules: [{ required: true, message: '请输入' }],
            initialValue: 5,
          })(
            <Input placeholder={0} type="number" style={{ width: 120 }} />
          )}
        </FormItem>
      </div>
    );
  }
  // 主页面
  render() {
    const { dialogVisible, payload } = this.state;
    const { liuhai, loading } = this.props;
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
            dataSource={liuhai.dataSource}
            columns={this.columns}
            scroll={{ x: FormConfig.width.maxwidth, y: 600 }}
            rowKey={FormConfig.liuhaiId}
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
