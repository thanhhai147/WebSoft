import React, { lazy, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TokenUtil from "../helpers/token.utils";
import UserContext from "../contexts/user.context";
import MainLayout from "../components/layout/main.layout";

const LoginPage = lazy(() => import("../pages/login.page"));
const BookPage = lazy(() => import("../pages/book.page"));
const BookType = lazy(() => import("../pages/bookType.page"));
const BookAuthor = lazy(() => import("../pages/bookAuthor.page"));
const ConsumerPage = lazy(() => import("../pages/consumer.page"));
const NotFoundPage = lazy(() => import("../pages/404.page"));

export default function AppRouter() {
  const [token, setToken] = useState(() => TokenUtil.getToken());
  const [username, setUsername] = useState(() => TokenUtil.getUsername());

  if (!token || token === "undefined") {
    return <LoginPage />;
  }

  let userContextValue = {
    token: token,
    username: username,
  };

  return (
    <>
      <UserContext.Provider value={userContextValue}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route path="/book" element={<BookPage />} />
              <Route path="/book-type" element={<BookType />} />
              <Route path="/author" element={<BookAuthor />} />
              <Route path="/consumer" element={<ConsumerPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </>
  );
}
