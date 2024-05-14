<<<<<<< HEAD
import React from "react";
import { Table } from "antd";
import "./styles/table.component.css";

export default function TableComponent({ columns, data, ...props }) {
  return (
    <div className="table-container p-3">
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.key}
        rowSelection={{ type: "checkbox" }}
        {...props}
      />
    </div>
  );
}
=======
import React, { useContext } from "react"
import { Table } from "antd"
import "./styles/table.component.css"
import ModalContext from "../../contexts/modal.context"
import EmptyComponent from "./empty.component"

export default function TableComponent({columns, data, ...props}) {

    const { setCheckedRows } = useContext(ModalContext)

    const handleOnSelect = (record, selected, selectedRows, nativeEvent) => {
        setCheckedRows(selectedRows)
    }

    const handleOnSelectAll = (selected, selectedRows, changeRows) => {
        setCheckedRows(selectedRows)
    }

    return (
        <div className="table-container p-3">
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record) => record.key}
                rowSelection={{ 
                    type: "checkbox",
                    onSelect: handleOnSelect,
                    onSelectAll: handleOnSelectAll
                }}
                locale={{
                    emptyText: EmptyComponent
                }}
                {...props}
            />
        </div>
    )
}
>>>>>>> 29c8b5051d075f302b79257dc0e8443b32e482ce
