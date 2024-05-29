import React, { lazy, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TokenUtil from "../helpers/token.utils";
import UserContext from "../contexts/user.context";
import MainLayout from "../components/layout/main.layout";
import BookContext from "../contexts/modal.context";

const LoginPage = lazy(() => import("../pages/login.page"));
const BookPage = lazy(() => import("../pages/book.page"));
const BookType = lazy(() => import("../pages/bookType.page"));
const BookAuthor = lazy(() => import("../pages/bookAuthor.page"));
const ConsumerPage = lazy(() => import("../pages/consumer.page"));
const PaymentPage = lazy(() => import("../pages/payment.page"));
const SettingPage = lazy(() => import("../pages/settings.page"));
const BookStorage = lazy(() => import("../pages/bookStorage.page"));
const BookStorageReportPage = lazy(() => import("../pages/bookStorageReport.page"))
const DebtReportPage = lazy(() => import("../pages/debtReport.page"))
const NotFoundPage = lazy(() => import("../pages/404.page"));

export default function AppRouter() {
  const [token] = useState(() => TokenUtil.getToken());
  const [username] = useState(() => TokenUtil.getUsername());
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [isDelete, setIsDelete] = useState(false);

  if (!token || token === "undefined") {
    return <LoginPage />;
  }

  let userContextValue = {
    token: token,
    username: username,
  };

  const showModal = (variant) => {
    variant === "create"
      ? setIsModalCreateOpen(true)
      : setIsModalEditOpen(true);
  };

  const closeModal = (variant) => {
    variant === "create"
      ? setIsModalCreateOpen(false)
      : setIsModalEditOpen(false);
  };

  return (
    <>
      <UserContext.Provider value={userContextValue}>
        <BookContext.Provider
          value={{
            isModalCreateOpen,
            isModalEditOpen,
            showModal,
            closeModal,
            selectedRecord,
            setSelectedRecord,
            isDelete,
            setIsDelete,
            checkedRows,
            setCheckedRows,
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route path="/book" element={<BookPage />} />
                <Route path="/book-type" element={<BookType />} />
                <Route path="/author" element={<BookAuthor />} />
                <Route path="/consumer" element={<ConsumerPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/settings" element={<SettingPage />} />
                <Route path="/book/storage" element={<BookStorage />} />
                <Route path="/book/report" element={<BookStorageReportPage />} />
                <Route path="/payment/report" element={<DebtReportPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </BookContext.Provider>
      </UserContext.Provider>
    </>
  );
}
