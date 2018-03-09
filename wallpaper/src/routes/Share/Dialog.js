import React from 'react';
import { Form, Modal } from 'antd';

const Dialog = Form.create()((props) => {
  const { modalVisible, handleAdd, handleModalVisible, payload, formItems } = props;
  return (
    <Modal
      title={payload.title}
      visible={modalVisible}
      onOk={handleAdd}
      onCancel={() => handleModalVisible()}
    >
      {formItems}
    </Modal>
  );
});

export default Dialog;
