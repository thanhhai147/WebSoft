import React, { lazy, useState } from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TokenUtil from '../helpers/token.utils';
import UserContext from '../contexts/user.context';

const LoginPage = lazy(() => import("../pages/login.page"))
const BookPage = lazy(() => import("../pages/book.page"))
const NotFoundPage = lazy(() => import("../pages/404.page"))

export default function AppRouter() {

    const [token, setToken] = useState(() => TokenUtil.getToken())
    const [username, setUsername] = useState(() => TokenUtil.getUsername())

    let userContextValue = {
        token: token,
        username: username
    }

    if(!token || token === "undefined") {
        return <LoginPage />
    }

    return (
        <>
            <UserContext.Provider value={userContextValue}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<BookPage />} />
                        <Route path="/book" element={<BookPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </BrowserRouter>
            </UserContext.Provider>
        </>
    );
}