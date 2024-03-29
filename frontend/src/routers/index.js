import React, { lazy, useState } from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TokenUtil from '../helpers/token.utils';

const LoginPage = lazy(() => import("../pages/login.page"))
const BookPage = lazy(() => import("../pages/book.page"))
const NotFoundPage = lazy(() => import("../pages/404.page"))

export default function AppRouter() {

    const [token, setToken] = useState(() => TokenUtil.getToken())
    const [username, setUsername] = useState()

    if(!token || token === "undefined") {
        return <LoginPage setToken={setToken} setUsername={setUsername} />
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/book" element={<BookPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}