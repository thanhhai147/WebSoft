import React, { lazy, useState } from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

const LoginPage = lazy(() => import("../pages/login.page"))
const BookPage = lazy(() => import("../pages/book.page"))
const NotFoundPage = lazy(() => import("../pages/404.page"))

export default function AppRouter() {

    const [token, setToken] = useState()

    if(!token) {
        return <LoginPage setToken={setToken} />
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