import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import '../page_styles/Register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        if (password.length < 6) {
            setErrorMessage('Пароль должен содержать не менее 6 символов.');
            return;
        }
        try {
            const response = await api.post('/register', { username, password, email });
            if (response.status === 201) {
                setUsername('');
                setPassword('');
                setEmail('');
                navigate('/login');
            }
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
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
                <h1 className="auth-title">Создать аккаунт</h1>
                <p className="auth-sub">Зарегистрируйтесь и начните пользоваться сервисом</p>
                {errorMessage && <p className="auth-error">{errorMessage}</p>}
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="auth-field">
                        <span>Имя пользователя</span>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Иван Петров"
                            autoComplete="name"
                        />
                    </label>
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
                            placeholder="Не менее 6 символов"
                            autoComplete="new-password"
                        />
                    </label>
                    <button type="submit" className="auth-submit">Зарегистрироваться</button>
                </form>
                <p className="auth-footer">
                    Уже есть аккаунт?{' '}
                    <Link to="/login">Войти</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
