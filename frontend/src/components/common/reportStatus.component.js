import React from 'react'
import './styles/reportStatus.component.css'

export default function ReportStatusComponent({ variant, data }) {
    return (
        (variant === 'add') ? <p className='add-component'>+{data}</p> : <p className='substract-component'>{data}</p>
    )
}