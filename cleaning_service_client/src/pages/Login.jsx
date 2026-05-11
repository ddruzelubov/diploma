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
            const response = await api.post('/login', {
                email,
                password,
            });

            if (response.status === 200) { 
                const data = response.data; 
                localStorage.setItem('token', data.token); 
                setAuthToken(data.token);
                const userRole = data.user.role; 
                localStorage.setItem('userRole', userRole); 
                onLogIn(); 
                navigate('/'); 
            } else {
                const errorData = await response.data; 
                setErrorMessage(errorData.message || 'Ошибка входа. Пожалуйста, проверьте свои учетные данные.');
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
        <div className="login-page">
            <h1>Вход</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Электронная почта:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <br />
                <label>
                    Пароль:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Войти</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </form>
            <p>
                У вас нет аккаунта?{' '}
                <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    );
};

export default Login;