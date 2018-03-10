import React from 'react';
import { Form, Row, Col, Button } from 'antd';

const Check = Form.create()((props) => {
  const { handleSearch, formItems } = props;
  return (
    <Form layout="inline">
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        { formItems || <Col md={8} sm={24}>查询组建表单内容为空</Col>}
        <Col md={8} sm={24}>
          <span>
            <Button type="primary" onClick={handleSearch} >查询</Button>
          </span>
        </Col>
      </Row>
    </Form>
  );
});

export default Check;
