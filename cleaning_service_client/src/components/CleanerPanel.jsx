import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../page_styles/NavBar.css';

const CleanerPanel = ({ onLogOut }) => {
    const linkClass = ({ isActive }) =>
        `nav-link${isActive ? ' nav-link--active' : ''}`;

    return (
        <header className="site-header site-header--cleaner">
            <nav className="navbar">
                <Link to="/" className="nav-brand">
                    <span className="nav-brand__mark" aria-hidden>✦</span>
                    CleanSpace — клинер
                </Link>
                <div className="nav-links">
                    <NavLink to="/" end className={linkClass}>Главная</NavLink>
                    <NavLink to="/cleaner/orders" className={linkClass}>Мои задания</NavLink>
                    <NavLink to="/cabinet" className={linkClass}>Кабинет</NavLink>
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

export default CleanerPanel;
