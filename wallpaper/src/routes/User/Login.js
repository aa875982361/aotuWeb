import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';

const { Tab, Captcha, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    uuid: 'uuid',
  }

  onTabChange = (type) => {
    this.setState({ type });
  }

  onGetCaptcha = () => {
    // console.log('onGetCaptcha', 'start');
    this.setState({
      uuid: (new Date().getTime().toString()),
    });
  }

  handleSubmit = (err, values) => {
    // console.log('handlesubmit', err, values);
    const { type, uuid } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
          uuid,
        },
      });
    }
  }

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }

  render() {
    const { login, submitting } = this.props;
    const { type, uuid } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          <Tab key="account" tab="账户密码登录">
            {
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage('账户或密码错误（admin/888888）')
            }
            <UserName name="account" placeholder="admin/user" />
            <Password name="password" placeholder="888888/123456" />
            <Captcha name="captcha" placeholder="11" uuid={uuid} onGetCaptcha={this.onGetCaptcha} />
          </Tab>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
