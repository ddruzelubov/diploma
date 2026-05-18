import React, { useEffect, useState } from 'react';
import api from '../api/api';
import '../page_styles/AdminServices.css';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [form, setForm] = useState({ name: '', description: '', base_price: '' });
    const [editingService, setEditingService] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await api.get('/services');
            setServices(res.data);
        } catch {
            setError('Не удалось загрузить услуги.');
        }
    };

    const resetForm = () => {
        setForm({ name: '', description: '', base_price: '' });
        setEditingService(null);
        setShowForm(false);
    };

    const handleEdit = (service) => {
        setEditingService(service);
        setForm({
            name: service.name,
            description: service.description,
            base_price: service.base_price.toString()
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const payload = {
            name: form.name,
            description: form.description,
            base_price: parseFloat(form.base_price)
        };
        try {
            if (editingService) {
                const res = await api.put(`/services/${editingService.id}`, payload);
                setServices(prev => prev.map(s => s.id === editingService.id ? res.data : s));
                setSuccess('Услуга обновлена.');
            } else {
                const res = await api.post('/services', payload);
                setServices(prev => [...prev, res.data]);
                setSuccess('Услуга добавлена.');
            }
            resetForm();
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError(editingService ? 'Не удалось обновить услугу.' : 'Не удалось добавить услугу.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить услугу? Это действие нельзя отменить.')) return;
        try {
            await api.delete(`/services/${id}`);
            setServices(prev => prev.filter(s => s.id !== id));
        } catch {
            setError('Не удалось удалить услугу.');
        }
    };

    return (
        <div className="as-page">
            <div className="as-header">
                <div>
                    <h1>Услуги</h1>
                    <p className="as-sub">Управляйте каталогом услуг клинингового сервиса.</p>
                </div>
                <button
                    className="as-add-btn"
                    onClick={() => {
                        if (showForm && !editingService) {
                            resetForm();
                        } else {
                            setEditingService(null);
                            setForm({ name: '', description: '', base_price: '' });
                            setShowForm(true);
                        }
                    }}
                >
                    {showForm && !editingService ? '✕ Отмена' : '+ Добавить услугу'}
                </button>
            </div>

            {error && <p className="as-error">{error}</p>}
            {success && <p className="as-success">{success}</p>}

            {showForm && (
                <div className="as-form-card">
                    <h2>{editingService ? 'Редактировать услугу' : 'Новая услуга'}</h2>
                    <form className="as-form" onSubmit={handleSubmit}>
                        <label className="as-field">
                            <span>Название</span>
                            <input
                                type="text"
                                placeholder="Уборка квартиры"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </label>
                        <label className="as-field">
                            <span>Описание</span>
                            <textarea
                                placeholder="Описание услуги"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                rows={3}
                                required
                            />
                        </label>
                        <label className="as-field">
                            <span>Цена за м² (Br)</span>
                            <input
                                type="number"
                                placeholder="15.00"
                                value={form.base_price}
                                onChange={e => setForm({ ...form, base_price: e.target.value })}
                                min="0.01"
                                step="0.01"
                                required
                            />
                        </label>
                        <div className="as-form-actions">
                            <button type="submit" className="as-submit-btn">
                                {editingService ? 'Сохранить изменения' : 'Добавить услугу'}
                            </button>
                            {editingService && (
                                <button type="button" className="as-cancel-btn" onClick={resetForm}>
                                    Отмена
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            <div className="as-list">
                {services.length === 0 ? (
                    <div className="as-empty">
                        <div className="as-empty__icon">🧹</div>
                        <p>Нет услуг. Добавьте первую.</p>
                    </div>
                ) : (
                    services.map(service => (
                        <div key={service.id} className="as-card">
                            <div className="as-card__info">
                                <strong className="as-card__name">{service.name}</strong>
                                <p className="as-card__desc">{service.description}</p>
                                <span className="as-card__price">
                                    {parseFloat(service.base_price).toFixed(2)} Br/м²
                                </span>
                            </div>
                            <div className="as-card__actions">
                                <button
                                    className="as-btn as-btn--edit"
                                    onClick={() => handleEdit(service)}
                                >
                                    Изменить
                                </button>
                                <button
                                    className="as-btn as-btn--delete"
                                    onClick={() => handleDelete(service.id)}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminServices;
