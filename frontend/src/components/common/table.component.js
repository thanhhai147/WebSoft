import React, { useContext } from "react"
import { Table } from "antd"
import "./styles/table.component.css"
import ModalContext from "../../contexts/modal.context"

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
                {...props}
            />
        </div>
    )
}