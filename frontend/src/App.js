import './App.css';
import React, { Suspense } from 'react';
import {ConfigProvider} from "antd";
import vn from "antd/lib/locale/vi_VN";
import AppRouter from './routers';


function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfigProvider locale={vn}>  
        <AppRouter /> 
      </ConfigProvider>         
    </Suspense>
  );
}

export default App;
