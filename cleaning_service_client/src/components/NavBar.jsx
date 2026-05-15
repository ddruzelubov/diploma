import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../page_styles/NavBar.css';

const NavBar = ({ isAuthenticated, onLogOut }) => {
    const linkClass = ({ isActive }) =>
        `nav-link${isActive ? ' nav-link--active' : ''}`;

    return (
        <header className="site-header">
            <nav className="navbar">
                <Link to="/" className="nav-brand">
                    <span className="nav-brand__mark" aria-hidden>✦</span>
                    CleanSpace
                </Link>
                <div className="nav-links">
                    <NavLink to="/" end className={linkClass}>Главная</NavLink>
                    <NavLink to="/services" className={linkClass}>Услуги</NavLink>
                    <NavLink to="/order-ratings" className={linkClass}>Оценки заказов</NavLink>
                    {isAuthenticated && (
                        <>
                            <NavLink to="/cabinet" className={linkClass}>Кабинет</NavLink>
                            <NavLink to="/orders" className={linkClass}>Мои заказы</NavLink>
                            <NavLink to="/payments" className={linkClass}>Платежи</NavLink>
                            <NavLink to="/user-ratings" className={linkClass}>Мои оценки</NavLink>
                        </>
                    )}
                </div>
                <div className="nav-auth">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="btn btn--ghost">Вход</Link>
                            <Link to="/register" className="btn btn--solid">Регистрация</Link>
                        </>
                    ) : (
                        <button type="button" className="btn btn--ghost" onClick={onLogOut}>
                            Выход
                        </button>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default NavBar;
