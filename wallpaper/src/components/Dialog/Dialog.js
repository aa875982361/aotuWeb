import React from 'react';
import { Form, Modal } from 'antd';

const Dialog = Form.create()((props) => {
  const { visible, handleAdd, handleDialogVisible, payload, formItems } = props;
  return (
    <Modal
      title={payload && payload.title ? payload.title : '新建'}
      visible={visible}
      onOk={handleAdd}
      onCancel={() => handleDialogVisible()}
    >
      {formItems}
    </Modal>
  );
});

export default Dialog;
