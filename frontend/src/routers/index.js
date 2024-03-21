import React, { lazy, useState } from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

const LoginPage = lazy(() => import("../pages/login"))
const BookPage = lazy(() => import("../pages/book"))
const NotFoundPage = lazy(() => import("../pages/404"))

export default function AppRouter() {

    const [token, setToken] = useState()

    if(!token) {
        return <LoginPage setToken={setToken} />
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    {/* <Route path="/login" element={<LoginPage />} /> */}
                    <Route path="/book" element={<BookPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}