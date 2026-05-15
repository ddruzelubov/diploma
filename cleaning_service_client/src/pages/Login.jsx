import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { setAuthToken } from '../api/api';
import '../page_styles/Login.css';

const Login = ({ onLogIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const response = await api.post('/login', { email, password });
            if (response.status === 200) {
                const data = response.data;
                localStorage.setItem('token', data.token);
                setAuthToken(data.token);
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userId', data.user.id);
                onLogIn();
                navigate('/');
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            const msg = error.response?.data?.error
                || error.response?.data?.message
                || 'Произошла ошибка при соединении с сервером.';
            setErrorMessage(msg);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">
                    <span className="auth-brand__mark">✦</span>
                    CleanSpace
                </div>
                <h1 className="auth-title">Добро пожаловать</h1>
                <p className="auth-sub">Войдите в личный кабинет</p>
                {errorMessage && <p className="auth-error">{errorMessage}</p>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="auth-field">
                        <span>Электронная почта</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="your@email.com"
                            autoComplete="email"
                        />
                    </label>
                    <label className="auth-field">
                        <span>Пароль</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            autoComplete="current-password"
                        />
                    </label>
                    <button type="submit" className="auth-submit">Войти</button>
                </form>
                <p className="auth-footer">
                    Нет аккаунта?{' '}
                    <Link to="/register">Зарегистрироваться</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
