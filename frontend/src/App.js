import './App.css';
import React, { Suspense } from 'react';
import {ConfigProvider} from "antd";
import vn from "antd/lib/locale/vi_VN";
import AppRouter from './routers';
import Loading from './components/common/loading.component';

function App() {
  return (
    <Suspense fallback={<Loading tip="Loading..." size={"large"} />}>
      <ConfigProvider locale={vn}>  
        <AppRouter /> 
      </ConfigProvider>         
    </Suspense>
  );
}

export default App;
