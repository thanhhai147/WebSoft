import React, { lazy, useState } from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TokenUtil from '../helpers/token.utils';

const LoginPage = lazy(() => import("../pages/login.page"))
const BookPage = lazy(() => import("../pages/book.page"))
const ConsumerPage = lazy(() => import("../pages/consumer.page"))
const NotFoundPage = lazy(() => import("../pages/404.page"))
const LogoutPage = lazy(() => import("../components/logout.component"))

export default function AppRouter() {

    const [token, setToken] = useState(() => TokenUtil.getToken())
    const [username, setUsername] = useState(() => TokenUtil.getUsername())

    if(!token || token === "undefined") {
        return <LoginPage />
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<BookPage />} />
                    <Route path="/book" element={<BookPage />} />
                    <Route path="/consumer" element={<ConsumerPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}