import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import "./styles/searchInput.component.css";

export default function SearchInput({ placeholder, onSearch, ...props }) {
  return (
    <div className="search-input" {...props}>
      <Input
        placeholder={placeholder}
        prefix={<SearchOutlined />}
        onChange={(e) => setTimeout(() => onSearch(e.target.value), 300)}
      />
    </div>
  );
}
