import React, {memo, useState} from 'react';
import { message, Upload, Table, Button } from 'antd';
import {isEmpty, filter} from 'lodash';
import { read, utils } from "xlsx";
import { ipcRenderer } from'electron';
import { UploadOutlined } from '@ant-design/icons';
import './style.less';
const { Dragger } = Upload;

const UploaderExcel = props => {
    const {onReset} = props;
    const [fileList, setFileList] = useState([]);
    
    const onChange = (info) => {
        const {file, fileList} = info;
        const newFileList = filter(fileList, {uid: file.uid})
        setFileList(newFileList);
        const fileReader = new FileReader();
        fileReader.onload = event => {
            try {
                const { result } = event.target;
                const workbook = read(result, { type: 'binary' });
                let data = [];
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        data = data.concat(utils.sheet_to_json(workbook.Sheets[sheet]));
                    }
                }
                const newData = data.filter((item) => {
                    if (item.hasOwnProperty('名称') && item.hasOwnProperty('号码') && item['名称'] && item['号码']) {
                        return true
                    }
                    return false
                })
                if (isEmpty(newData)) {
                   return message.warning('数据不符合格式，请重新上传！');
                }
                ipcRenderer.send('add-batch-data', newData);
                ipcRenderer.on('add-batch-data', (event, data) => {
                    if (data === 'success') {
                        onReset();
                        message.success('电话簿已存储成功！');
                    }
                });
            } catch (e) {
                console.log(e);
            }
        };
        fileReader.readAsBinaryString(file);
    }

    const beforeUpload = () => {return false;}

    const customRequest = ({file, onSuccess}) => {
        const { files } = file.target;
        setTimeout(() => {
            onSuccess('ok');
        }, 2000);
    }
    const onRemove = info => {
        const newFileList = filter(fileList, item => {
            return item.uid !== info.uid;
        })
        setFileList(newFileList);
        return false;
    }

    return (
        <Upload 
            onChange={onChange}
            accept='.xlsx, .xls'
            customRequest={customRequest}
            beforeUpload={beforeUpload}
            multiple={false}
            onRemove={onRemove}
            fileList={fileList}
        >
            <Button icon={<UploadOutlined />}>点击上传</Button>
        </Upload>
    );
};

export default memo(UploaderExcel);