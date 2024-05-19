import React, { lazy, useContext, useEffect, useState } from 'react'
import SettingUtil from '../helpers/settings.utils'
import { Form } from 'antd'
import ModalContext from "../contexts/modal.context"
import { TITLE, MESSAGE } from '../messages/main.message'
import { NotificationComponent } from '../components/common/notification.component'

const PageTitle = lazy(() => import("../components/common/pageTitle.component"))
const TableToolBar = lazy(() => import("../components/common/tableToolBar.component"))
const Table = lazy(() => import("../components/common/table.component"))
const EditButton = lazy(() => import("../components/common/editButton.component"))
const SettingForm = lazy(() => import("../components/settings-management/settingForm.component"))
const ModalEditSetting = lazy(() => import("../components/settings-management/modalEditSetting.component"))
const BookStatusComponent = lazy(() => import("../components/common/bookStatus.component"))

const { getAllSetting, editSetting, deleteSetting } = SettingUtil

const columns = [
  {
    title: "Tên tham số",
    dataIndex: "ParameterName",
    key: "ParameterName",
  },
  {
    title: "Giá trị",
    dataIndex: "Value",
    key: "Value",
  },
  {
    title: "Tình trạng",
    dataIndex: "Active",
    key: "Active",
    render: (text, record, index) => text ? <BookStatusComponent variant={'active'} /> : <BookStatusComponent variant={'inactive'}/>
  },
  {
    title: "Chỉnh sửa",
    key: "Edit",  
    render: (record) => <EditButton record={record} />,
  },
]

export default function SettingPage () {
  const [settingTable, setSettingTable] = useState(null)
  const [filterTable, setFilterTable] = useState(null);
  const [form] = Form.useForm();
  const {
    isModalEditOpen,
    showModal,
    closeModal,
    selectedRecord,
    isDelete,
    setIsDelete,
    checkedRows
  } = useContext(ModalContext);

  useEffect(() => {
    form.setFieldsValue(selectedRecord);
  }, [form, selectedRecord]);

  useEffect(() => {
    getAllSetting()
    .then(settingData => setSettingTable(settingData))
  }, [])

  useEffect(() => {
    if(isDelete) {
      const parameterNameList = checkedRows.map(row => row.ParameterName)
      deleteSetting(parameterNameList).then(response => {
        console.log(response)
        if(response) {
          console.log(response)
          NotificationComponent('success', TITLE.SUCCESS, MESSAGE.DELETE_SUCCESS)
          console.log("delete success")
          getAllSetting()
          .then(parameterData => setSettingTable(parameterData))
        }
      })

      setIsDelete(false)
    }
  }, [isDelete, checkedRows])

  const handleOk = () => {
    form
      .validateFields()
      .then(async () => {
        const values = form.getFieldsValue();
        let settingData = values

        const response = await editSetting(selectedRecord.ParameterName, settingData)

        if(response) {
          NotificationComponent('success', TITLE.SUCCESS, MESSAGE.EDIT_SUCCESS)
          getAllSetting()
          .then(settingData => setSettingTable(settingData))
        }

        form.resetFields();
        closeModal('edit');
      })
      .catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
        NotificationComponent('error', TITLE.ERROR, MESSAGE.HAS_AN_ERROR)
      });
  };

  const handleCancel = () => {
    form.resetFields();
    closeModal('edit');
  };

  const search = (value) => {
    const filteredData = settingTable.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );

    setFilterTable(filteredData);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <PageTitle title={"Tuỳ chỉnh"} />
      <TableToolBar 
        className={'mb-3'} 
        placeholder={"Tìm kiếm tên, giá trị và tình trạng tham số"}
        onSearch={search}
        showModal={showModal}
      />
      <Table
        columns={columns}
        data={filterTable == null ? settingTable : filterTable}
        onChange={onChange}
        sticky={true}
      />

      <ModalEditSetting
        open={isModalEditOpen}
        onOk={() => handleOk()}
        onCancel={() => handleCancel()}
      >
        <SettingForm variant="update" form={form} record={selectedRecord} />
      </ModalEditSetting>
    </div>
  );
};
