import React, {useState} from 'react';
import { read, utils } from "xlsx";
import {Button, message, Tabs} from "antd";
import { ipcRenderer } from'electron';
import {TAB_LABEL, TAB_TYPE} from '@/config';
import Search from 'pages/Search';
import Black from 'pages/Black';
import UploaderExcel from 'component/UploaderExcel';
import './style.less';

const UploadExcel = props => {

  const [tabKey, setTabKey] = useState(1);

  const onChange = key => {
    setTabKey(key);
  }

    return (
      <div>
        <Tabs
          onChange={onChange}
          value={tabKey}
          defaultActiveKey="2"
          items={[
            {
              label: TAB_LABEL[TAB_TYPE.SEARCH],
              key: '2',
              children: <Search tabKey={tabKey} />,
            },
            {
              label: TAB_LABEL[TAB_TYPE.BLACK],
              key: '3',
              children: <Black />,
            },
          ]}
        />
      </div >
    );
};

export default UploadExcel;