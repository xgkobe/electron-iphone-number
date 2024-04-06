import React from 'react';
import UploadExcel from './pages/Home';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <div>
        <ConfigProvider locale={zhCN}>
        <UploadExcel />
        </ConfigProvider>
    </div>
);