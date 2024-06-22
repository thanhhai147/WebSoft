import React, { lazy, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TokenUtil from "../helpers/token.utils";
import UserContext from "../contexts/user.context";
import MainLayout from "../components/layout/main.layout";
import BookContext from "../contexts/modal.context";
import NotAuthorization from "../pages/unauthorization.page";
import ProtectedRoute from "../helpers/protectedRoutes.utils";

const LoginPage = lazy(() => import("../pages/login.page"));
const BookPage = lazy(() => import("../pages/book.page"));
const BookType = lazy(() => import("../pages/bookType.page"));
const BookAuthor = lazy(() => import("../pages/bookAuthor.page"));
const ConsumerPage = lazy(() => import("../pages/consumer.page"));
const OrderPage = lazy(() => import("../pages/order.page"));
const PaymentPage = lazy(() => import("../pages/payment.page"));
const SettingPage = lazy(() => import("../pages/settings.page"));
const BookStorage = lazy(() => import("../pages/bookStorage.page"));
const BookStorageReportPage = lazy(() =>
  import("../pages/bookStorageReport.page")
);
const DebtReportPage = lazy(() => import("../pages/debtReport.page"));
const NotFoundPage = lazy(() => import("../pages/404.page"));

export default function AppRouter() {
  const [token] = useState(() => TokenUtil.getToken());
  const [username] = useState(() => TokenUtil.getUsername());
  const role = TokenUtil.getRole();
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
    role: role,
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
                <Route
                  path="/book"
                  element={
                    <ProtectedRoute allowedRoles={["A", "SE", "SM"]}>
                      <BookPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/book-type"
                  element={
                    <ProtectedRoute allowedRoles={["A", "SE", "SM"]}>
                      <BookType />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/author"
                  element={
                    <ProtectedRoute allowedRoles={["A", "SE", "SM"]}>
                      <BookAuthor />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/consumer"
                  element={
                    <ProtectedRoute allowedRoles={["A", "SM"]}>
                      <ConsumerPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order"
                  element={
                    <ProtectedRoute allowedRoles={["A", "SM"]}>
                      <OrderPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment"
                  element={
                    <ProtectedRoute allowedRoles={["A", "SM"]}>
                      <PaymentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute allowedRoles={["A"]}>
                      <SettingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/book/storage"
                  element={
                    <ProtectedRoute allowedRoles={["A", "SE"]}>
                      <BookStorage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/book/report"
                  element={
                    <ProtectedRoute allowedRoles={["A", "SE"]}>
                      <BookStorageReportPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment/report"
                  element={
                    <ProtectedRoute allowedRoles={["A"]}>
                      <DebtReportPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/not-authorized" element={<NotAuthorization />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </BookContext.Provider>
      </UserContext.Provider>
    </>
  );
}
