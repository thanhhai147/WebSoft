import React from "react";
import { Statistic, Card } from "antd"
import { PlusOutlined, MinusOutlined } from "@ant-design/icons"
import CountUp from 'react-countup';
import "./styles/statistic.component.css"

const formatter = (value) => <CountUp end={value} separator="," />;

export default function StatisticComponent ({
    variant = "normal" | "positive" | "negative", 
    title, 
    value, 
    precision, 
    prefix, 
    suffix, 
    ...props 
}) {
    let color = ""
    let icon = null
    switch(variant) {
        case "normal":
            color = "var(--font-color-default)"
            break
        case "import":
            color = "var(--success-color)"
            icon = <PlusOutlined />
            break
        case "export":
            color = "var(--failed-color)"
            icon = <MinusOutlined />
            break
        default:
            color = "var(--font-color-default)"
            break 
    }

    return (
        <Card bordered={false}>
            <Statistic
                title={title}
                value={value}
                precision={precision}
                valueStyle={{
                    color: color
                }}
                prefix={icon}
                suffix={suffix}
                formatter={formatter}
                {...props}
            />
        </Card>
    )
}