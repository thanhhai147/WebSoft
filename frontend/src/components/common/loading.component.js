import React from 'react';
import { Spin } from 'antd';
import "./styles/loading.component.css"

export default function Loading({ tip, size }) {
    return (
        <div id='loading-container' className='d-flex justify-content-center align-items-center'>
            <Spin tip={tip} size={size} fullscreen></Spin>
        </div>
    )
};