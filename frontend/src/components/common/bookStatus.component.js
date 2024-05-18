import React from 'react'
import './styles/bookStatus.component.css'

export default function BookStatusComponent({ variant }) {
    return (
        (variant === 'active') ? <p className='active-component'>Khả dụng</p> : <p className='inactive-component'>Không khả dụng</p>
    )
}