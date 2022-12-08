import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ResponsiveAppBar from '../components/navbar';
import Login from './login';
import Register from './register';
import Logout from './logout';
import Admin from './admin';
import { ContextProvider } from '../context/userContext';
const RoutesPage = () => {
    
    return (
        <>
            <ContextProvider>
                <Router>
                    <ResponsiveAppBar />
                    <Routes>
                        <Route path="/" element={<App />} />
                        <Route path="/Home" element={<App />} />
                        <Route path="/Login" element={<Login />} />
                        <Route path="/Register" element={<Register />} />
                        <Route path="/Logout" element={<Logout />} />
                        <Route path="/Admin" element={<Admin />} />
                        {/* Should create an error page (Something simple like an image or something) for any invalid routes */}
                        <Route path="*" element={<App />} />
                    </Routes>
                </Router>
            </ContextProvider>
        </>
    )
}

export default RoutesPage;

