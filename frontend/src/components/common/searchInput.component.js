import React from "react"
import { Input } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import "./styles/searchInput.component.css"

export default function SearchInput({placeholder, ...props}) {

    return (
        <div className="search-input" {...props}>
            <Input
                placeholder={placeholder}
                prefix={<SearchOutlined />}
            />
        </div>
    )
}