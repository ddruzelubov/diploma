import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import AdminPanel from './components/AdminPanel';
import CleanerPanel from './components/CleanerPanel';
import Register from './pages/Register';
import Login from './pages/Login';
import ServiceList from './pages/ServiceList';
import HomePage from './pages/HomePage';
import OrdersPage from './pages/OrdersPage';
import ServiceRatingsPage from './pages/ServiceRatingsPage';
import OrderServicePage from './pages/OrderServicePage';
import ServiceRatings from './pages/ServiceRatings';
import OrderRatings from './pages/OrderRatings';
import OrderRatingPage from './pages/OrderRatingPage';
import UserRatingsPage from './pages/UserRatingsPage';
import AdminServices from './pages/AdminServices';
import UserList from './pages/UserList';
import AdminOrders from './pages/AdminOrders';
import AdminRatings from './pages/AdminRatings';
import AdminCleaners from './pages/AdminCleaners';
import CleanerOrders from './pages/CleanerOrders';
import ProfilePage from './pages/ProfilePage';
import { setAuthToken } from './api/api';
import './App.css';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCleaner, setIsCleaner] = useState(false);

    const syncAuthFromStorage = useCallback(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        if (token) {
            setAuthToken(token);
            setIsAuthenticated(true);
            setIsAdmin(userRole === 'admin');
            setIsCleaner(userRole === 'cleaner');
        } else {
            setAuthToken(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
            setIsCleaner(false);
        }
    }, []);

    useEffect(() => {
        syncAuthFromStorage();
    }, [syncAuthFromStorage]);

    const handleLogIn = () => {
        syncAuthFromStorage();
    };

    const handleLogOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setAuthToken(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setIsCleaner(false);
    };

    const renderNav = () => {
        if (isAdmin) return <AdminPanel onLogOut={handleLogOut} />;
        if (isCleaner) return <CleanerPanel onLogOut={handleLogOut} />;
        return <NavBar isAuthenticated={isAuthenticated} onLogOut={handleLogOut} />;
    };

    return (
        <Router>
            <div className="app">
                {renderNav()}
                <main className="content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login onLogIn={handleLogIn} />} />
                        <Route path="/cabinet" element={<ProfilePage />} />
                        <Route path="/services" element={<ServiceList />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/rating-service" element={<ServiceRatingsPage />} />
                        <Route path="/order-service" element={<OrderServicePage />} />
                        <Route path="/service-ratings/:serviceId" element={<ServiceRatings />} />
                        <Route path="/order-ratings" element={<OrderRatings />} />
                        <Route path="/order-rating/:orderId" element={<OrderRatingPage />} />
                        <Route path="/user-ratings" element={<UserRatingsPage />} />
                        <Route path="/cleaner/orders" element={<CleanerOrders />} />
                        <Route path="/admin/services" element={<AdminServices />} />
                        <Route path="/admin/users" element={<UserList />} />
                        <Route path="/admin/orders" element={<AdminOrders />} />
                        <Route path="/admin/ratings" element={<AdminRatings />} />
                        <Route path="/admin/cleaners" element={<AdminCleaners />} />
                    </Routes>
                </main>
                <footer className="footer">
                    <div className="footer-inner">
                        <span className="footer-brand">CleanSpace</span>
                        <span className="footer-copy">© 2026 Клининговый сервис. Все права защищены.</span>
                    </div>
                </footer>
            </div>
        </Router>
    );
};

export default App;
