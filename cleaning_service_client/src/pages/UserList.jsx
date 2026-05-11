import React, { useEffect, useState } from 'react';
import api from '../api/api';
import '../page_styles/UserList.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '' });
    const [successMessage, setSuccessMessage] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);

    // Функция для загрузки пользователей
    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await api.get('/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Не удалось загрузить пользователей.');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        const token = localStorage.getItem('token');
        try {
            await api.delete(`/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsers(users.filter(user => user.id !== id)); 
        } catch (error) {
            console.error('Error deleting user:', error);
            setError('Не удалось удалить пользователя.');
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/register', {
                username: newAdmin.username,
                email: newAdmin.email,
                password: newAdmin.password,
                role: 'admin'
            });
            setSuccessMessage(response.data.message);
            fetchUsers(); 
            setNewAdmin({ username: '', email: '', password: '' });
        } catch (error) {
            console.error('Error adding admin:', error);
            setError('Не удалось добавить администратора.');
        }
    };

    return (
        <div className="user-list-page">
            <h1>Список пользователей</h1>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}

            <button onClick={() => setIsFormVisible(!isFormVisible)}>
                {isFormVisible ? 'Скрыть форму' : 'Добавить администратора'}
            </button>
            
            {isFormVisible &&
                <form onSubmit={handleAddAdmin}>
                    <h2>Добавить администратора</h2>
                    <input 
                        type="text" 
                        placeholder="Имя" 
                        value={newAdmin.username} 
                        onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} 
                        required 
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={newAdmin.email} 
                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Пароль" 
                        value={newAdmin.password} 
                        onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} 
                        required 
                    />
                    <button type="submit">Добавить</button>
                </form>
            }           

            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <h3>{user.username}</h3>
                        <p>Email: {user.email}</p>
                        <button onClick={() => handleDeleteUser(user.id)}>Удалить</button> 
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;