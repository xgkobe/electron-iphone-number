import React, {memo, useEffect, useState} from 'react';
import {forEach, isEmpty, isArray, partial} from 'lodash';
import {write, utils} from "xlsx";
import { UserOutlined, PhoneOutlined, FileSearchOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import {Input, Button, Table, message, Modal, Form} from 'antd';
import { ipcRenderer } from'electron';
import UploaderExcel from 'component/UploaderExcel';
import UpdateModal from 'component/UpdateModal';
import AddModal from 'component/AddModal';
import './style.less';

const { confirm } = Modal;

const Black = props => {
    const {tabKey} = props;
    const [iphones, setIphones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updateRecord, setUpdateRecord] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [form] = Form.useForm();

    const getAllData = () => {
        ipcRenderer.send('search-all-data');
        setLoading(true);
        ipcRenderer.on('search-all-data', (event, data) => {
            setLoading(false);
            setIphones(data);
        });
    }

    const onReset = () => {
        form.resetFields();
        getAllData();
    }

    useEffect(() => {
        ipcRenderer.removeAllListeners('search-data');
        getAllData();
    }, [tabKey]);

    const onDelete = id => {
        console.log(id);
        ipcRenderer.send('delete-one-data', id);
        ipcRenderer.on('delete-one-data', (event, data) => {
            onReset();
        });
    };

    const onUpdate = (record) => {
        setIsModalOpen(true);
        setUpdateRecord(record);
    };

    const onRemoveBlack = () => {}

    const columns = [
        {
            title: '名称',
            dataIndex: '名称',
        },
        {
            title: '号码',
            dataIndex: '号码',
        },
        {
            title: '备注',
            dataIndex: '备注',
            render: (value) => {
                return value || '-'
            }
        },
        {
            title: '操作',
            dataIndex: '操作',
            render: (value, record) => {
                return (
                    <div className='button-opreas'>
                        <Button type="link" onClick={partial(onDelete, record.id)}>删除</Button>
                        <Button type="link" onClick={partial(onUpdate, record)}>修改</Button>
                    </div>
                )
            }
        },
    ]

    const onClearAll = () => {
        confirm({
            title: '您想要清空整个电话簿吗?',
            icon: <ExclamationCircleFilled />,
            content: '',
            onOk() {
                ipcRenderer.send('clear-data', iphones);
            },
            onCancel() {},
          });
        ipcRenderer.on('clear-data', (event, data) => {
            if (data === 'success') {
                getAllData();
                message.success('已清空电话簿');
            }
        });
    };

    const onFinish = (values) => {
        const params = {};
        forEach(values, (value, name) => {
            if (value !== undefined) {
                params[name] = value;
            }
        });
        if (!isEmpty(params)) {
            ipcRenderer.send('search-data', params);
            setLoading(true);
            ipcRenderer.on('search-data', (event, data) => {
                setLoading(false);
                if (isArray(data)) {
                    setIphones(data);
                }
            });
        } else {
            getAllData();
        }
      };

    const onAdd = () => {
        setAddModalOpen(true);
    }

    const onDownloadXlsx = () => {
        const data = [
            ['名称', '号码', '备注'],
            ['张三', 15729006789, '公司号码'],
        ];
        const ws = utils.aoa_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Sheet1');
        const buf = write(wb, { type: 'buffer', bookType: 'xlsx' });
        ipcRenderer.send('download-xlsx-template', {data: buf, name: '黑名单模版'});
        ipcRenderer.on('download-success', () => {
            message.success('已成功下载至桌面');
            ipcRenderer.removeAllListeners('download-success');
        });
    };

    return (
        <div className='search'>
            <div>
                <Form
                    form={form}
                    onFinish={onFinish}
                >
                    <div className='search-box'>
                        <Form.Item
                            name="名称"
                            label="名称"
                            colon={false}
                        >
                            <Input placeholder="请输入名称" allowClear prefix={<UserOutlined />} />
                        </Form.Item>
                        <Form.Item
                            name="号码"
                            label="号码"
                            colon={false}
                        >
                            <Input placeholder="请输入号码" allowClear prefix={<PhoneOutlined />} />
                        </Form.Item>
                        <Form.Item
                            name="备注"
                            label="备注"
                            colon={false}
                        >
                            <Input placeholder="请输入备注" allowClear prefix={<FileSearchOutlined />} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" style={{marginRight: '8px'}} htmlType="submit">查询</Button>
                            <Button htmlType="button" onClick={onReset}>清空</Button>
                        </Form.Item>
                        <span className='span-link' onClick={onDownloadXlsx}>模版下载</span>
                    </div>
                </Form>
            </div>
            <div className='form-buttons'>
                <Button type="primary" onClick={onAdd}>新增</Button>
                <Button onClick={onClearAll} disabled={iphones.length === 0}>清空电话簿</Button>
                <UploaderExcel onReset={onReset} />
            </div>
            <Table
                columns={columns} 
                dataSource={iphones}
                className='search-box-table'
                loading={loading}
                rowKey='id'
            />
            {isModalOpen && <UpdateModal setIsModalOpen={setIsModalOpen} record={updateRecord} onReset={onReset} />}
            {isAddModalOpen && <AddModal setIsModalOpen={setAddModalOpen} onReset={onReset} />}
        </div>
    );
};

export default memo(Black);