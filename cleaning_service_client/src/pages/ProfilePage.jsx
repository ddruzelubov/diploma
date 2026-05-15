import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api/api';
import '../page_styles/ProfilePage.css';

const roleMeta = {
    admin: { label: 'Администратор', cls: 'role-badge--admin' },
    cleaner: { label: 'Клинер', cls: 'role-badge--cleaner' },
    user: { label: 'Клиент', cls: 'role-badge--user' },
};

const ProfilePage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [form, setForm] = useState({
        username: '',
        email: '',
        currentPassword: '',
        newPassword: '',
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { state: { from: '/cabinet' } });
            return;
        }
        setAuthToken(token);

        const load = async () => {
            try {
                const { data } = await api.get('/users/me');
                setProfile(data);
                setForm(f => ({ ...f, username: data.username || '', email: data.email || '' }));
            } catch {
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(f => ({ ...f, [name]: value }));
        setMessage({ type: '', text: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        try {
            const payload = { username: form.username, email: form.email };
            if (form.newPassword) {
                payload.currentPassword = form.currentPassword;
                payload.newPassword = form.newPassword;
            }
            const { data } = await api.put('/users/me', payload);
            setProfile(data);
            setForm(f => ({ ...f, username: data.username, email: data.email, currentPassword: '', newPassword: '' }));
            setMessage({ type: 'ok', text: 'Данные сохранены' });
        } catch (err) {
            const text = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Не удалось сохранить';
            setMessage({ type: 'err', text });
        }
    };

    if (loading) {
        return <div className="profile-page profile-page--loading"><p>Загрузка кабинета…</p></div>;
    }

    const rm = roleMeta[profile?.role] || roleMeta.user;
    const isCleaner = profile?.role === 'cleaner';

    return (
        <div className="profile-page">
            <header className="profile-hero">
                <div>
                    <p className="profile-eyebrow">Личный кабинет</p>
                    <h1>Привет, {profile?.username}</h1>
                    <p className="profile-sub">Управляйте профилем и переходите к заказам в один клик.</p>
                </div>
                <div className="profile-role">
                    <span className={`role-badge ${rm.cls}`}>{rm.label}</span>
                </div>
            </header>

            <div className="profile-grid">
                <section className="profile-card">
                    <h2>Данные аккаунта</h2>
                    <form className="profile-form" onSubmit={handleSubmit}>
                        <label className="field">
                            <span>Имя</span>
                            <input name="username" value={form.username} onChange={handleChange} required autoComplete="username" />
                        </label>
                        <label className="field">
                            <span>Email</span>
                            <input name="email" type="email" value={form.email} onChange={handleChange} required autoComplete="email" />
                        </label>
                        <h3 className="profile-form__h3">Смена пароля</h3>
                        <p className="hint">Оставьте поля пароля пустыми, если менять пароль не нужно.</p>
                        <label className="field">
                            <span>Текущий пароль</span>
                            <input name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} autoComplete="current-password" />
                        </label>
                        <label className="field">
                            <span>Новый пароль</span>
                            <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} minLength={6} autoComplete="new-password" />
                        </label>
                        {message.text && (
                            <p className={message.type === 'ok' ? 'form-msg form-msg--ok' : 'form-msg form-msg--err'}>
                                {message.text}
                            </p>
                        )}
                        <button type="submit" className="btn-primary">Сохранить изменения</button>
                    </form>
                </section>

                <aside className="profile-card profile-card--aside">
                    <h2>Быстрые действия</h2>
                    <nav className="profile-links">
                        {isCleaner ? (
                            <>
                                <Link className="profile-link profile-link--featured" to="/cleaner/orders">
                                    <span className="profile-link__icon">🧹</span>
                                    Мои задания
                                </Link>
                                <Link className="profile-link" to="/order-ratings">Все оценки заказов</Link>
                            </>
                        ) : (
                            <>
                                <Link className="profile-link profile-link--featured" to="/services">
                                    <span className="profile-link__icon">✦</span>
                                    Каталог услуг
                                </Link>
                                <Link className="profile-link" to="/orders">Мои заказы</Link>
                                <Link className="profile-link" to="/user-ratings">Оценки моих заказов</Link>
                                <Link className="profile-link" to="/order-ratings">Все оценки заказов</Link>
                            </>
                        )}
                    </nav>
                </aside>
            </div>
        </div>
    );
};

export default ProfilePage;
