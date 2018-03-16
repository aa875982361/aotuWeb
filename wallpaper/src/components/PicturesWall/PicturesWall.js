import React from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import request from '../../utils/request';
import { CONFIG } from '../../common/config';

class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    data: {
      token: '',
      key: '',
    },
    file: {},
  };

  /**
  * 上传图片之前的操作
  */
  checkPictrue = (fileValue) => {
    console.log('checkPictrue');
    if (!beforeUpload(fileValue)) {
      this.setState({
        file: {},
      });
      return false;
    }
    this.setState({
      file: fileValue,
    });
    const keyvalue = mykey();
    const response = request(CONFIG.host + CONFIG.urls.getToken + keyvalue);
    if (response) {
      response.then((value) => {
        console.log('checkPictrue', value.token);
        this.setState({
          data: {
            token: value.token,
            key: keyvalue,
          },
        });
      });
    }
    return response;
  }

  handleCancel = () => this.setState({ previewVisible: false })
  /**
   * 预览图片
   */
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }
  /**
   * 图片上传状态改变
   */
  handleChange = (info) => {
    const { handleResponse, name } = this.props;
    const { data } = this.state;
    console.log('handleChange', info);
    if (info.file.status === 'removed') {
      this.setState({
        file: {},
      });
      handleResponse({
        ...data,
        name,
      });
      return;
    }
    if (info.file.status === 'done') {
      // 这里可以获取到回调
      console.log('handleChange', info.file.response);
      const res = info.file.response;
      this.setState({
        file: info.file,
      });
      handleResponse({
        ...data,
        ...res,
        name,
      });
    }
  }

  render() {
    const { imgsrc } = this.props;
    const { previewVisible, previewImage, file, data } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="//upload-z2.qiniu.com/"
          listType="picture-card"
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          beforeUpload={this.checkPictrue}
          data={data}
          // fileList={fileList}
          file={file}
        >
          {file.status ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={imgsrc || previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

//  时间戳来自客户端，精确到毫秒，但仍旧有可能在在多线程下有并发，
//  尤其hash化后，毫秒数前面的几位都不变化，导致不同日期hash化的值有可能存在相同，
//  因此使用下面的随机数函数，在时间戳上加随机数，保证hash化的结果差异会比较大
/*
 ** randomWord 产生任意长度随机字母数字组合
 ** randomFlag-是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
 ** 用法  randomWord(false,6);规定位数 flash
 *  randomWord(true,3，6);长度不定，true
 * arr变量可以把其他字符加入，如以后需要小写字母，直接加入即可
 */
function randomWord(randomFlag, min, max) {
  let str = '';
  let range = min;
  const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min;
  }
  for (let i = 0; i < range; i += 1) {
    const pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }
  return str;
}
function mykey() {
  const date = new Date();
  const fornt = ''.concat(date.getFullYear().toString(), (date.getMonth() + 1) < 10 ? '0'.concat((date.getMonth() + 1)) : (date.getMonth() + 1), date.getDate(), '/', randomWord(false, 36));
  console.log('myKey', fornt);
  return fornt;
}
