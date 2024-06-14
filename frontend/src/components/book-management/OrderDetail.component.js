import React, {useEffect, useState} from 'react'
import TableComponent from '../common/table.component'
import BaseAPIInstance from '../../api/base.api';

const columns = [
    {
        title: "Mã sách",
        dataIndex: "BookId",
        key: "BookId",
    },
    {
        title: "Tên sách",
        dataIndex: "BookName",
        key: "BookName",
    },
    {
        title: "Số lượng",
        dataIndex: "Quantity",
        key: "Quantity",
        sorter: (a, b) => a.Quantity - b.Quantity,
        render: (text, record, index) => text.toLocaleString(),
    },
    {
        title: "Đơn giá bán (VND)",
        dataIndex: "UnitSoldPrice",
        key: "UnitSoldPrice",
        sorter: (a, b) => a.UnitSoldPrice - b.UnitSoldPrice,
        render: (text, record, index) => text.toLocaleString(),
    },
    {
        title: "Thành tiền (VND)",
        dataIndex: "SoldPrice",
        key: "SoldPrice",
        sorter: (a, b) => a.SoldPrice - b.SoldPrice,
        render: (text, record, index) => text.toLocaleString(),
    }
];



export default function OrderDetai({data}) {
    const [bookOrders, setBookOrders] = useState(null)
    const [books, setBooks] = useState(null)

    const getAllBooks = async () => {
        const response = await BaseAPIInstance.get(`/book`);
        let bookObj = {}
        Object.values(response.data).forEach(book => {
            bookObj[book.id] = book.bookName
        })

        setBooks(bookObj)
    }

    useEffect(() => {
        getAllBooks()
    }, [])

    useEffect(() => {
        let bookOrderData = data.BookOrders
        bookOrderData = bookOrderData.map(BookOrder => ({
            key: BookOrder.BookId,
            ...BookOrder,
            BookName: books?.[BookOrder.BookId],
            SoldPrice: BookOrder.Quantity * BookOrder.UnitSoldPrice
        }))
        setBookOrders(bookOrderData)
    }, [data, books])

    return (
        <TableComponent
            columns={columns}
            data={bookOrders}
            disableRowSelection={true}
        />
    )
}