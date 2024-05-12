import React, { lazy } from "react";
import "./styles/tableToolBar.component.css";

const SearchInput = lazy(() => import("./searchInput.component"));
const Button = lazy(() => import("./button.component"));

export default function TableToolBar({
  className,
  placeholder,
  onSearch,
  showModal,
  ...props
}) {
  return (
    <div
      className={
        "table-toolbar p-3 d-flex align-items-center justify-content-between" +
        " " +
        className
      }
      {...props}
    >
      <SearchInput
        placeholder={placeholder}
        style={{ width: "40%" }}
        onSearch={onSearch}
      />
      <div
        className="btn-wrapper d-flex align-items-center justify-content-end"
        style={{ width: "30%" }}
      >
        <Button
          buttonCase="create"
          style={{ marginRight: "1rem" }}
          onClick={() => showModal("create")}
        />
        <Button buttonCase="delete" />
      </div>
    </div>
  );
}
