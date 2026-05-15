import React, { useEffect, useState } from 'react';
import api from '../api/api';
import '../page_styles/UserList.css';

const roleLabel = {
    admin: { text: 'Администратор', cls: 'role--admin' },
    cleaner: { text: 'Клинер', cls: 'role--cleaner' },
    user: { text: 'Клиент', cls: 'role--user' },
};

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '' });
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [filter, setFilter] = useState('all');

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch {
            setError('Не удалось загрузить пользователей.');
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Удалить пользователя?')) return;
        try {
            await api.delete(`/user/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
            setSuccess('Пользователь удалён.');
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Не удалось удалить пользователя.');
        }
    };

    const handleAddAdmin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/register', { ...newAdmin, role: 'admin' });
            setSuccess(response.data.message || 'Администратор добавлен.');
            fetchUsers();
            setNewAdmin({ username: '', email: '', password: '' });
            setIsFormVisible(false);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Не удалось добавить администратора.');
        }
    };

    const displayed = filter === 'all' ? users : users.filter(u => u.role === filter);

    return (
        <div className="ul-page">
            <div className="ul-header">
                <div>
                    <h1>Пользователи</h1>
                    <p className="ul-sub">Список всех зарегистрированных пользователей.</p>
                </div>
                <button className="ul-add-btn" onClick={() => { setIsFormVisible(!isFormVisible); setError(''); }}>
                    {isFormVisible ? '✕ Отмена' : '+ Добавить администратора'}
                </button>
            </div>

            {error && <p className="ul-error">{error}</p>}
            {success && <p className="ul-success">{success}</p>}

            {isFormVisible && (
                <div className="ul-form-card">
                    <h2>Новый администратор</h2>
                    <form className="ul-form" onSubmit={handleAddAdmin}>
                        <label className="ul-field">
                            <span>Имя</span>
                            <input type="text" placeholder="Имя" value={newAdmin.username}
                                onChange={e => setNewAdmin({ ...newAdmin, username: e.target.value })} required />
                        </label>
                        <label className="ul-field">
                            <span>Email</span>
                            <input type="email" placeholder="admin@example.com" value={newAdmin.email}
                                onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })} required />
                        </label>
                        <label className="ul-field">
                            <span>Пароль</span>
                            <input type="password" placeholder="Минимум 6 символов" value={newAdmin.password}
                                onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })} required minLength={6} />
                        </label>
                        <button type="submit" className="ul-submit-btn">Добавить</button>
                    </form>
                </div>
            )}

            <div className="ul-filters">
                {['all', 'user', 'cleaner', 'admin'].map(f => (
                    <button
                        key={f}
                        className={`ul-filter-btn ${filter === f ? 'ul-filter-btn--active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? 'Все' : roleLabel[f]?.text || f}
                        <span className="ul-filter-count">
                            {f === 'all' ? users.length : users.filter(u => u.role === f).length}
                        </span>
                    </button>
                ))}
            </div>

            {displayed.length === 0 ? (
                <div className="ul-empty">
                    <p>Нет пользователей в этой категории.</p>
                </div>
            ) : (
                <div className="ul-grid">
                    {displayed.map(user => {
                        const rl = roleLabel[user.role] || { text: user.role, cls: 'role--user' };
                        return (
                            <div key={user.id} className="ul-card">
                                <div className="ul-card__avatar">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="ul-card__info">
                                    <strong className="ul-card__name">{user.username}</strong>
                                    <span className="ul-card__email">{user.email}</span>
                                    <span className={`ul-role-badge ${rl.cls}`}>{rl.text}</span>
                                </div>
                                <button className="ul-delete-btn" onClick={() => handleDeleteUser(user.id)} title="Удалить">
                                    🗑
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UserList;
