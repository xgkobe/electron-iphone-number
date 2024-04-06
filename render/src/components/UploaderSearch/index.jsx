import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { read, utils } from "xlsx";
import {isEmpty, filter} from 'lodash';
const UploaderSearch = props => {
    const {value, onChange, onBatchSearch} = props;

    const [fileList, setFileList] = useState([]);
    
    const onUploadChange = (info) => {
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
                message.success('上传成功！')
                console.log(data);
                onBatchSearch(data);
            } catch (e) {
                console.log(e);
            }
        };
        fileReader.readAsBinaryString(file);
    }

    const beforeUpload = () => {return false;}

    useEffect(() => {
    }, []);

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
            onChange={onUploadChange}
            accept='.xlsx, .xls'
            customRequest={customRequest}
            beforeUpload={beforeUpload}
            multiple={false}
            onRemove={onRemove}
            fileList={fileList}
        >
        <Button icon={<UploadOutlined />}>点进上传</Button>
        </Upload>
    );
};

export default UploaderSearch;