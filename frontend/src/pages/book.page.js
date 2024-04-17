import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Button, Table, Input } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Book Type",
    dataIndex: "bookType",
    key: "bookType",
  },
  {
    title: "Author",
    dataIndex: "author",
    key: "author",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <span>
        <Button
          type="primary"
          style={{ marginRight: 16 }}
          icon={<EditOutlined />}
        >
          Sửa
        </Button>
      </span>
    ),
  },
];

const data = [
  {
    key: "1",
    name: "Book 1",
    bookType: "Type 1",
    author: "Author 1",
    price: 100,
  },
  {
    key: "2",
    name: "Book 2",
    bookType: "Type 2",
    author: "Author 2",
    price: 200,
  },
  {
    key: "3",
    name: "Book 3",
    bookType: "Type 3",
    author: "Author 3",
    price: 300,
  },
];

const BookPage = () => {
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <h1 style={{ marginBottom: 32 }}>Danh sách sản phẩm</h1>

      <div style={{ marginBottom: 64, display: "flex", gap: "20px" }}>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          onSearch={(value) => console.log(value)}
          style={{
            backgroundColor: "#CFD8DC",
            width: 800,
            borderRadius: 20,
          }}
        />

        <Button danger icon={<DeleteOutlined />}>
          Xóa bỏ
        </Button>
        <Button type="primary" icon={<PlusCircleOutlined />}>
          Tạo mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record.key}
        rowSelection={{ type: "checkbox" }}
        onChange={onChange}
      />
    </div>
  );
};

export default BookPage;
