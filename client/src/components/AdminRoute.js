import React, {
    useContext
} from 'react';
import {
    Navigate,
    Outlet
} from 'react-router-dom';
import {
    AuthContext
} from '../context/AuthContext';

const AdminRoute = () => {
    const {
        user,
        token
    } = useContext(AuthContext);

    if (!token) {
        return <Navigate to = "/login"
        replace / > ;
    }

    if (user && user.role !== 'admin') {
       
        return <Navigate to = "/dashboard"
        replace / > ;
    }

    return <Outlet / > ;
};

export default AdminRoute;