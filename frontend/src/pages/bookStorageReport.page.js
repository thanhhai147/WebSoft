import React, { lazy, useState } from 'react'
import { Select } from 'antd'
import "./styles/report.page.css"

const PageTitle = lazy(() => import("../components/common/pageTitle.component"))
const Statistic = lazy(() => import("../components/common/statistic.component"))
const DatePicker = lazy(() => import("../components/common/datePicker.component"))
const LineChart = lazy(() => import("../components/common/lineChart.component"))
const Table = lazy(() => import("../components/common/table.component"))
const Button = lazy(() => import("../components/common/button.component"))

const columns = [
  {
    title: "Mã sách",
    dataIndex: "BookId",
    key: "BookId",
  },
  {
    title: "Tên sách",
    dataIndex: "BookName",
    key: "BookName",
  },
  {
    title: "Tồn đầu",
    dataIndex: "InventoryStart",
    key: "InventoryStart",
    sorter: (a, b) => a.quantity - b.quantity,
    render: (text, record, index) => text.toLocaleString()
  },
  {
    title: "Phát sinh nhập",
    dataIndex: "StorageNow",
    key: "StorageNow",
    sorter: (a, b) => a.quantity - b.quantity,
    render: (text, record, index) => text.toLocaleString()
  },
  {
    title: "Phát sinh bán",
    dataIndex: "OrderNow",
    key: "OrderNow",
    sorter: (a, b) => a.quantity - b.quantity,
    render: (text, record, index) => text.toLocaleString()
  },
  {
    title: "Tồn cuối",
    dataIndex: "InventoryEnd",
    key: "InventoryEnd",
    sorter: (a, b) => a.quantity - b.quantity,
    render: (text, record, index) => text.toLocaleString()
  },
]

const options = [
  {
    label: 'Thống kê',
    value: 'summarize'
  },
  {
    label: 'Chi tiết',
    value: 'detail'
  }
]

export default function ConsumerPage () {
  const [mode, setMode] = useState('summarize')
  return (
    <div className='d-flex flex-column'>
      <PageTitle title="Lập báo cáo tồn kho" />
      <div className='report-filter-container mb-3 p-3 d-flex flex-row align-items-center'>
        <DatePicker variant={"range"} size='large' />
        <Button buttonCase="download" className="ml-auto mr-3" />
        <Select 
          options={options}
          defaultValue={'summarize'}
          size='large'
          onSelect={option=>setMode(option)}
        />
      </div>
      <div className='report-container d-flex flex-row'>
        <div className='statistic-container col-2'>
            <div>
                <Statistic title={"Số lượng sách nhập"} value={150000} />
            </div>
            <div className='mt-5'>
                <Statistic title={"Số lượng sách bán"} value={7650} variant={"positive"}/>
            </div>
            <div className='mt-5'>
                <Statistic title={"Số lượng sách tồn kho"} value={150000 - 7650} variant={"negative"} />
            </div>
        </div>
        <div className='visualization-container col-10'>
          {
            mode === 'summarize' ?
            <LineChart /> :
            <Table 
              columns={columns}
              // data={filterTable == null ? consumerTable : filterTable}
              // onChange={onChange}
              sticky={true}
              disableRowSelection={true}
            />
          }
        </div>
      </div>
    </div>
  );
};
