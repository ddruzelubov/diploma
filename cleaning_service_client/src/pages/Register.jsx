import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import api from '../api/api'; 
import '../page_styles/Register.css'; 

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
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
            const response = await api.post('/register', {
                username,
                password,
                email,
            });

            if (response.status === 201) { 
                setUsername('');
                setPassword('');
                setEmail('');
                navigate('/login'); 
            } else {
                const errorData = await response.data; 
                setErrorMessage(errorData.message || 'Ошибка регистрации. Пожалуйста, попробуйте еще раз.');
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
        <div className="register-page">
            <h1>Регистрация</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Имя пользователя:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <br />
                <button type="submit">Зарегистрироваться</button>
                {errorMessage && <p className="error-message">{errorMessage}</p>} 
            </form>
            <p>
                У вас уже есть аккаунт?{' '}
                <Link to="/login">Войти</Link>
            </p>
        </div>
    );
};

export default Register;