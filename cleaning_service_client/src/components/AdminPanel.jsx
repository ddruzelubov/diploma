import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../page_styles/NavBar.css';

const AdminPanel = ({ onLogOut }) => {
    const linkClass = ({ isActive }) =>
        `nav-link${isActive ? ' nav-link--active' : ''}`;

    return (
        <header className="site-header site-header--admin">
            <nav className="navbar">
                <Link to="/" className="nav-brand">
                    <span className="nav-brand__mark" aria-hidden>✦</span>
                    CleanSpace — админ
                </Link>
                <div className="nav-links">
                    <NavLink to="/" end className={linkClass}>Главная</NavLink>
                    <NavLink to="/admin/services" className={linkClass}>Услуги</NavLink>
                    <NavLink to="/admin/users" className={linkClass}>Пользователи</NavLink>
                    <NavLink to="/admin/orders" className={linkClass}>Заказы</NavLink>
                    <NavLink to="/admin/ratings" className={linkClass}>Отзывы</NavLink>
                </div>
                <div className="nav-auth">
                    <button type="button" className="btn btn--ghost" onClick={onLogOut}>
                        Выход
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default AdminPanel;
