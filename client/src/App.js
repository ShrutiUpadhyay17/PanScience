import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';

// Components for Route Protection
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* --- Protected Routes for Standard Users --- */}
                {}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>

                {/* --- Protected Routes for Admin Users --- */}
                {}
                <Route element={<AdminRoute />}>
                    <Route path="/admin/users" element={<UserManagementPage />} />
                </Route>

                {/* Fallback Routes */}
                {}
                <Route path="/" element={<Navigate to="/dashboard" />} />
                {/* Agar koi anjaan URL daala jaata hai, to login page par bhej do */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;