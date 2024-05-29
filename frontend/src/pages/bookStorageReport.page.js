import React, { lazy, useState, useEffect } from 'react'
import { Select } from 'antd'
import dayjs from 'dayjs'
import ReportUtil from '../helpers/report.utils'
import "./styles/report.page.css"

const PageTitle = lazy(() => import("../components/common/pageTitle.component"))
const Statistic = lazy(() => import("../components/common/statistic.component"))
const DatePicker = lazy(() => import("../components/common/datePicker.component"))
const LineChart = lazy(() => import("../components/common/lineChart.component"))
const Table = lazy(() => import("../components/common/table.component"))
const Button = lazy(() => import("../components/common/button.component"))
const ReportStatus = lazy(() => import("../components/common/reportStatus.component"))

const { getStorageReport } = ReportUtil

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
    sorter: (a, b) => a - b,
    render: (text, record, index) => text ? text.toLocaleString() : 0
  },
  {
    title: "Phát sinh nhập",
    dataIndex: "StorageNow",
    key: "StorageNow",
    sorter: (a, b) => a - b,
    render: (text, record, index) => text ? <ReportStatus variant={'add'} data={text.toLocaleString()} /> : 0
  },
  {
    title: "Phát sinh bán",
    dataIndex: "OrderNow",
    key: "OrderNow",
    sorter: (a, b) => a - b,
    render: (text, record, index) => text ? <ReportStatus variant={'subtract'} data={text.toLocaleString()} /> : 0
  },
  {
    title: "Tồn cuối",
    dataIndex: "InventoryEnd",
    key: "InventoryEnd",
    sorter: (a, b) => a - b,
    render: (text, record, index) => text ? text.toLocaleString() : 0
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

const setInitialRangeDate = () => [
  dayjs().set('month', dayjs().get('month') - 1),
  dayjs()
]

const DATE_FORMAT = "YYYY-MM-DD"
const DATE_FORMAT_LOCAL = "DD/MM/YYYY"
const DATE_BINS = 8

const totalReduce = (total, item) => total + item.Quantity

const splitDateRange = (startDate, endDate, bins) => {
  if (startDate >= endDate || bins === 0) return

  const interval = (endDate-startDate) / bins

  let dateSplit = []
  dateSplit.push(dayjs(startDate + 0).format(DATE_FORMAT))
  for (let i=1; i <= bins - 1; i++) {
    dateSplit.push(dayjs(startDate + i * interval).format(DATE_FORMAT))
  }
  dateSplit.push(dayjs(endDate + 0).format(DATE_FORMAT))

  return dateSplit
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Thống kế tồn kho qua các ngày',
      font: {
        family: "'Nunito', sans-serif",
        size: 20,
        weight: 'bold',
      },
      color: 'rgb(30, 60, 114)'
    },
    datalabels: {
      display: true,
      align: 'top',
      font: {
        family: "'Nunito', sans-serif",
        weight: 'bold',
        size: 14
      }
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          family: "'Nunito', sans-serif",
          weight: 'normal',
        },
      },
      grid: {
        display: true
      }
    },
    y: {
      ticks: {
        font: {
          family: "'Nunito', sans-serif",
          weight: 'normal',
        }
      },
      grid: {
        display: true
      }
    }
  }
};

export default function BookStorageReportPage () {
  const [mode, setMode] = useState('summarize')
  const [rangeDate, setRangeDate] = useState(setInitialRangeDate)
  const [report, setReport] = useState(null)
  const [statistic, setStatistic] = useState(null)
  const [reportTable, setReportTable] = useState(null)
  const [reportChart, setReportChart] = useState(null)

  const onDatePickerChange = (dates, dateStrings) => {
    setRangeDate(dates)
  }

  const getReportData = async () => {
    if (rangeDate === null || rangeDate === undefined) return

    const reportData = await getStorageReport({
      startDate: rangeDate[0].format(DATE_FORMAT),
      endDate: rangeDate[1].format(DATE_FORMAT)
    })

    if(reportData) {
      setReport(reportData)
    }
  }

  useEffect(() => {
    if (rangeDate === null || rangeDate === undefined) return

    getReportData()
  }, [rangeDate])

  useEffect(() => {
    if (report === null || report === undefined) return
    // Summarize data for statistic cars
    setStatistic({
      InventoryStart: Math.abs((report.InventoryStart ? Object.values(report.InventoryStart) : []).reduce(totalReduce, 0)),
      InventoryEnd: Math.abs((report.InventoryEnd ? Object.values(report.InventoryEnd) : []).reduce(totalReduce, 0)),
      StorageNow: Math.abs((report.StorageNow ? Object.values(report.StorageNow) : []).reduce(totalReduce, 0)),
      OrderNow: Math.abs((report.OrderNow ? Object.values(report.OrderNow) : []).reduce(totalReduce, 0))
    })
    // Summarize data for detailed table
    let bookObj = {}

    if(report.InventoryStart) Object.entries(report.InventoryStart).forEach(item => bookObj[item[0]] = item[1].BookName)
    if(report.InventoryEnd) Object.entries(report.InventoryEnd).forEach(item => bookObj[item[0]] = item[1].BookName)
    if(report.StorageNow) Object.entries(report.StorageNow).forEach(item => bookObj[item[0]] = item[1].BookName)
    if(report.OrderNow) Object.entries(report.OrderNow).forEach(item => bookObj[item[0]] = item[1].BookName) 
      
    
    setReportTable(Object.keys(bookObj).map(bookId => ({
      key: bookId,
      BookId: bookId,
      BookName: bookObj[bookId],
      InventoryStart: report?.InventoryStart?.[bookId]?.Quantity,
      InventoryEnd: report.InventoryEnd?.[bookId]?.Quantity,
      StorageNow: report.StorageNow?.[bookId]?.Quantity,
      OrderNow: report.OrderNow?.[bookId]?.Quantity
    })))

    // Summarize data for chart
    const dateBins = splitDateRange(dayjs(report.Start, DATE_FORMAT), dayjs(report.End, DATE_FORMAT), DATE_BINS)
    let storageByDate = []

    for (let _ in dateBins) {
      storageByDate.push(statistic?.InventoryStart ? statistic?.InventoryStart : 0)
    }

    if(report?.StorageNow) {
      Object.values(report.StorageNow).forEach(item => {
        for (let idx in storageByDate) {
          if (item?.Created <= dateBins[idx]) storageByDate[idx] += item.Quantity
        }
      })
    }

    if(report?.OrderNow) {
      Object.values(report.OrderNow).forEach(item => {
        for (let idx in storageByDate) {
          if (item?.Created <= dateBins[idx]) storageByDate[idx] -= item.Quantity
        }
      })
    }

    setReportChart({
      labels: dateBins.map(date => dayjs(date, DATE_FORMAT).format(DATE_FORMAT_LOCAL)),
      datasets: [
        {
          data: storageByDate,
          borderColor: 'rgba(63, 131, 255, 0.5)',
          backgroundColor: 'rgb(30, 60, 114)',
          borderWidth: 3
        }
      ]
    })

  }, [report])


  return (
    <div className='d-flex flex-column'>
      <PageTitle title="Lập báo cáo tồn kho" />
      <div className='report-filter-container mb-3 p-3 d-flex flex-row align-items-center'>
        <DatePicker 
          variant='range' 
          size='large'
          defaultValue={rangeDate}
          onChange={onDatePickerChange}
        />
        {/* <Button buttonCase="download" className="ml-auto mr-3" /> */}
        <Select 
          className='ml-auto'
          options={options}
          defaultValue='summarize'
          size='large'
          onSelect={option=>setMode(option)}
        />
      </div>
      <div className='report-container d-flex flex-row'>
        <div className='statistic-container col-2'>
            <div>
                <Statistic title={"Tổng tồn đầu"} value={statistic?.InventoryStart} />
            </div>
            <div className='mt-5'>
                <Statistic title={"Tổng phát sinh nhập"} value={statistic?.StorageNow} variant={"import"}/>
            </div>
            <div className='mt-5'>
                <Statistic title={"Tổng phát sinh bán"} value={statistic?.OrderNow} variant={"export"} />
            </div>
            <div className='mt-5'>
                <Statistic title={"Tổng tồn cuối"} value={statistic?.InventoryEnd} />
            </div>
        </div>
        <div className='visualization-container col-10'>
          {
            mode === 'summarize' ?
            (reportChart ? <LineChart data={reportChart} options={chartOptions} /> : null) :
            <Table 
              columns={columns}
              data={reportTable}
              sticky={true}
              disableRowSelection={true}
            />
          }
        </div>
      </div>
    </div>
  );
};
