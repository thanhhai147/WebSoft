import React, { useContext } from "react";
import { Table } from "antd";
import "./styles/table.component.css";
import ModalContext from "../../contexts/modal.context";
import EmptyComponent from "./empty.component";

export default function TableComponent({ columns, data, disableRowSelection = false, onClick, ...props }) {
  const { setCheckedRows } = useContext(ModalContext);

  const handleOnSelect = (record, selected, selectedRows, nativeEvent) => {
    setCheckedRows(selectedRows);
  };

  const handleOnSelectAll = (selected, selectedRows, changeRows) => {
    setCheckedRows(selectedRows);
  };

  const rowSelection = {
    type: "checkbox",
    onSelect: handleOnSelect,
    onSelectAll: handleOnSelectAll,
  }

  return (
    <div className="table-container p-3">
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.key}
        rowSelection={
          disableRowSelection ? null : rowSelection
        }
        locale={{
          emptyText: EmptyComponent,
        }}
        onRow={(record, index) => {
          return ({
            onClick: (event) => onClick(record, index, event)
          })
        }}
        {...props}
      />
    </div>
  );
}
