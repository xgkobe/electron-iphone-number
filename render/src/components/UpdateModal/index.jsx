import React, {useState} from 'react';
import {Modal, Form, InputNumber, Input } from 'antd';
import {ipcRenderer} from'electron';
import './style.less';

const UpdateModal = props => {
  const {setIsModalOpen, record, onReset} = props;
  
  const [form] = Form.useForm();


  const handleOk = () => {
    form.validateFields().then((values) => {
        ipcRenderer.send('update-data', {...values, id: record.id});
        ipcRenderer.on('update-data', (event, data) => {
            setIsModalOpen(false);
            onReset();
        });
    })
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
      <Modal title="修改" open onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} className='update-modal-form'>
            <Form.Item
                name="名称"
                label="名称"
                colon={false}
                rules={[{ required: true, message: '请输入' }]}
                initialValue={record['名称']}
            >
                <Input placeholder="请输入名称" allowClear />
            </Form.Item>
            <Form.Item
                name="号码"
                label="号码"
                rules={[{ required: true, message: '请输入' }]}
                initialValue={record['号码']}
                colon={false}
            >
                <InputNumber placeholder="请输入号码" style={{ width: 415 }} allowClear/>
            </Form.Item>
            <Form.Item
                name="备注"
                label="备注"
                initialValue={record['备注']}
                colon={false}
            >
                <Input placeholder="请输入备注" allowClear />
            </Form.Item>
        </Form>
      </Modal>
  );
};
export default UpdateModal;