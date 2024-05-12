import React from "react"
import { Table } from "antd"
import "./styles/table.component.css"

export default function TableComponent({columns, data, ...props}) {

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
    )
}