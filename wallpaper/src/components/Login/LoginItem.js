import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col } from 'antd';
import omit from 'omit.js';
import map from './map';

const FormItem = Form.Item;

function generator({ defaultProps, defaultRules, type }) {
  return (WrappedComponent) => {
    return class BasicComponent extends Component {
      static contextTypes = {
        form: PropTypes.object,
        updateActive: PropTypes.func,
      };
      constructor(props) {
        super(props);
        this.state = {
          count: 0,
          imgUrl: 'http://wallpaper-cms.t.talkmoney.cn/api/picCaptcha/getPicCaptcha?uuid=',
        };
      }
      componentDidMount() {
      }
      componentWillUnmount() {
      }
      render() {
        const { getFieldDecorator } = this.context.form;
        const options = {};
        let otherProps = {};
        const { onChange, defaultValue, onGetCaptcha, rules, name, ...restProps } = this.props;
        const { imgUrl } = this.state;
        options.rules = rules || defaultRules;
        if (onChange) {
          options.onChange = onChange;
        }
        if (defaultValue) {
          options.initialValue = defaultValue;
        }
        otherProps = restProps || otherProps;
        if (type === 'Captcha') {
          const inputProps = omit(otherProps, ['onGetCaptcha']);
          return (
            <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator(name, options)(
                    <WrappedComponent {...defaultProps} {...inputProps} />
                  )}
                </Col>
                <Col span={8}>
                  <img alt="验证码" src={imgUrl + this.props.uuid} onClick={onGetCaptcha} />
                </Col>
              </Row>
            </FormItem>
          );
        }
        return (
          <FormItem>
            {getFieldDecorator(name, options)(
              <WrappedComponent {...defaultProps} {...otherProps} />
            )}
          </FormItem>
        );
      }
    };
  };
}

const LoginItem = {};
Object.keys(map).forEach((item) => {
  LoginItem[item] = generator({
    defaultProps: map[item].props,
    defaultRules: map[item].rules,
    type: item,
  })(map[item].component);
});

export default LoginItem;
