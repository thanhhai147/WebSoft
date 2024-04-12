import MainLayout from "../layouts/main.layout";
import { Button, Table, Input } from "antd";

const { Search } = Input;

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
  },
  {
    title: "Action",
    key: "action",
    render: (text, record) => (
      <span>
        <Button type="primary" style={{ marginRight: 16 }}>
          Edit
        </Button>
        <Button danger>Delete</Button>
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

const bookContent = (
  <div>
    <h1>Danh sách sản phẩm</h1>

    <div style={{ marginBottom: 16, display: "flex", gap: "20px" }}>
      <Search
        placeholder="Tìm kiếm sản phẩm"
        enterButton="Tìm kiếm"
        onSearch={(value) => console.log(value)}
      />

      <Button danger>Xóa bỏ</Button>
      <Button type="primary">Tạo mới</Button>
    </div>

    <Table columns={columns} dataSource={data} />
  </div>
);

export default function BookPage() {
  return <MainLayout pageContent={bookContent} />;
}
