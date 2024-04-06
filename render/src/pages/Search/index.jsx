import React, {memo, useState} from 'react';
import {forEach, isEmpty, isArray} from 'lodash';
import {Table, Form, message} from 'antd';
import UploaderSearch from 'component/UploaderSearch';
import {write, utils} from "xlsx";
import {ipcRenderer} from'electron';
import './style.less';

const Search = props => {
    const [iphones, setIphones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onBatchSearch = data => {
        ipcRenderer.send('search-batch-data', data);
        setLoading(true);
        ipcRenderer.on('search-batch-data', (event, data) => {
            setLoading(false);
            setIphones(data);
        });
    };

    const columns = [
        {
            title: '序号',
            dataIndex: '序号',
            render: (_, record, index) => {
                return ++index
            }
        },
        {
            title: '号码',
            dataIndex: '号码',
        },
        {
            title: '名称',
            dataIndex: '名称',
            render: (value) => {
                return value || '不知道'
            }
        },
        {
            title: '通信类型',
            dataIndex: '通信类型',
            render: (value) => {
                return value || '-'
            }
        },
        {
            title: '通话时间',
            dataIndex: '通话时间',
            render: (value) => {
                return value || '-'
            }
        },
        {
            title: '通信时长',
            dataIndex: '通信时长',
            render: (value) => {
                return value || '-'
            }
        },
    ]

    const onFinish = (values) => {
        const params = {};
        console.log(values);
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
        }
      };

    const onReset = () => {
        form.resetFields();
        getAllData();
    }

    const onDownloadXlsx = () => {
        const data = [
            ['通信类型', '对方号码', '起始时间', '通信时长'],
            ['国内异地', 15729006789, '2024/4/1 10:00:00', '51秒'],
        ];
        const ws = utils.aoa_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Sheet1');
        const buf = write(wb, { type: 'buffer', bookType: 'xlsx' });
        ipcRenderer.send('download-xlsx-template', {data: buf, name: '电话查询模版'});
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
                        {/* <Form.Item
                            name="号码"
                            label="号码"
                            colon={false}
                        >
                            <Input placeholder="请输入号码" allowClear prefix={<PhoneOutlined />} />
                        </Form.Item> */}
                        <Form.Item
                            name="批量查询"
                            label="批量查询"
                            colon={false}
                        >
                            <UploaderSearch onBatchSearch={onBatchSearch} />
                        </Form.Item>
                        <span className='span-link' onClick={onDownloadXlsx}>模版下载</span>
                    </div>
                    {/* <Form.Item>
                        <div className='form-buttons'>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button htmlType="button" onClick={onReset}>清空</Button>
                        </div>
                    </Form.Item> */}
                </Form>
            </div>
            <Table
                columns={columns} 
                dataSource={iphones}
                className='search-box-table'
                loading={loading}
                rowKey='id'
            />
        </div>
    );
};

export default memo(Search);