import React from "react"
import  { DatePicker } from "antd"
import "./styles/datePicker.component.css"

export default function DatePickerComponent({
    variant = "moment" | "range",
    picker = "date",
    size = "middle",
    defaultValue,
    onChange,
    ...props
}) {
    const { RangePicker } = DatePicker
    const dateFormat = "DD/MM/YYYY"

    return (
        <div className="date-picker-container">
            {
                variant === "moment" ? 
                <DatePicker format={dateFormat} picker={picker} size={size} onChange={onChange} defaultValue={defaultValue} {...props}/> :
                <RangePicker format={dateFormat} picker={picker} size={size} onChange={onChange} defaultValue={defaultValue} {...props}/>
            }
        </div>
    )
}