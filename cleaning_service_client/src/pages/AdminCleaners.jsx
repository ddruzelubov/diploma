import React, { useEffect, useState } from 'react';
import api from '../api/api';
import '../page_styles/AdminCleaners.css';

const AdminCleaners = () => {
    const [cleaners, setCleaners] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchCleaners = async () => {
        try {
            const res = await api.get('/cleaners');
            setCleaners(res.data);
        } catch {
            setError('Не удалось загрузить клинеров.');
        }
    };

    useEffect(() => { fetchCleaners(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить клинера?')) return;
        try {
            await api.delete(`/user/${id}`);
            setCleaners(prev => prev.filter(c => c.id !== id));
            setSuccess('Клинер удалён.');
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Не удалось удалить клинера.');
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await api.post('/cleaners', form);
            setSuccess('Клинер успешно добавлен!');
            setForm({ username: '', email: '', password: '' });
            setShowForm(false);
            fetchCleaners();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Не удалось добавить клинера.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="ac-page">
            <div className="ac-header">
                <div>
                    <h1>Клинеры</h1>
                    <p className="ac-sub">Управляйте командой специалистов по уборке.</p>
                </div>
                <button className="ac-add-btn" onClick={() => { setShowForm(!showForm); setError(''); }}>
                    {showForm ? '✕ Отмена' : '+ Добавить клинера'}
                </button>
            </div>

            {error && <p className="ac-error">{error}</p>}
            {success && <p className="ac-success">{success}</p>}

            {showForm && (
                <div className="ac-form-card">
                    <h2>Новый клинер</h2>
                    <form className="ac-form" onSubmit={handleAdd}>
                        <label className="ac-field">
                            <span>Имя</span>
                            <input
                                type="text"
                                placeholder="Иван Иванов"
                                value={form.username}
                                onChange={e => setForm({ ...form, username: e.target.value })}
                                required
                            />
                        </label>
                        <label className="ac-field">
                            <span>Email</span>
                            <input
                                type="email"
                                placeholder="cleaner@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </label>
                        <label className="ac-field">
                            <span>Пароль</span>
                            <input
                                type="password"
                                placeholder="Минимум 6 символов"
                                value={form.password}
                                onChange={e => setForm({ ...form, password: e.target.value })}
                                required
                                minLength={6}
                            />
                        </label>
                        <button type="submit" className="ac-submit-btn" disabled={submitting}>
                            {submitting ? 'Добавление…' : 'Добавить клинера'}
                        </button>
                    </form>
                </div>
            )}

            {cleaners.length === 0 ? (
                <div className="ac-empty">
                    <div className="ac-empty__icon">👷</div>
                    <p>Клинеры ещё не добавлены.</p>
                    <p className="ac-empty__sub">Нажмите «Добавить клинера», чтобы создать первую запись.</p>
                </div>
            ) : (
                <div className="ac-grid">
                    {cleaners.map(cleaner => (
                        <div key={cleaner.id} className="ac-card">
                            <div className="ac-card__avatar">
                                {cleaner.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="ac-card__info">
                                <strong className="ac-card__name">{cleaner.username}</strong>
                                <span className="ac-card__email">{cleaner.email}</span>
                                <span className="ac-badge">Клинер</span>
                            </div>
                            <button
                                className="ac-delete-btn"
                                onClick={() => handleDelete(cleaner.id)}
                                title="Удалить"
                            >
                                🗑
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminCleaners;
