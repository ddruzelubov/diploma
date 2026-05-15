import React, { useEffect, useState } from 'react';
import api, { setAuthToken } from '../api/api';
import { useNavigate } from 'react-router-dom';
import '../page_styles/UserRatingsPage.css';

const Stars = ({ value }) => (
    <span className="ur-stars">
        {[1, 2, 3, 4, 5].map(s => (
            <span key={s} className={s <= value ? 'ur-star ur-star--filled' : 'ur-star'}>★</span>
        ))}
    </span>
);

const UserRatingsPage = () => {
    const [orderRatings, setOrderRatings] = useState([]);
    const [serviceRatings, setServiceRatings] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        setAuthToken(token);

        Promise.all([
            api.get('/userRatings').catch(() => ({ data: [] })),
            api.get('/reviews').catch(() => ({ data: [] }))
        ]).then(([orderRes, serviceRes]) => {
            setOrderRatings(orderRes.data);
            setServiceRatings(serviceRes.data);
        }).catch(() => setError('Не удалось получить оценки'));
    }, [navigate]);

    const deleteOrderRating = async (id) => {
        try {
            await api.delete(`/ratings/${id}`);
            setOrderRatings(prev => prev.filter(r => r.id !== id));
        } catch {
            setError('Не удалось удалить оценку');
        }
    };

    const deleteServiceRating = async (id) => {
        try {
            await api.delete(`/reviews/${id}`);
            setServiceRatings(prev => prev.filter(r => r.id !== id));
        } catch {
            setError('Не удалось удалить оценку');
        }
    };

    return (
        <div className="ur-page">
            <div className="ur-header">
                <h1>Мои оценки</h1>
                <p className="ur-sub">История ваших оценок заказов и услуг.</p>
            </div>

            {error && <p className="ur-error">{error}</p>}

            <section className="ur-section">
                <h2 className="ur-section-title">
                    Оценки заказов
                    <span className="ur-count">{orderRatings.length}</span>
                </h2>
                {orderRatings.length === 0 ? (
                    <p className="ur-empty">Нет оценок заказов.</p>
                ) : (
                    <div className="ur-list">
                        {orderRatings.map(r => (
                            <div key={r.id} className="ur-card">
                                <div className="ur-card__info">
                                    <div className="ur-card__top">
                                        <span className="ur-card__label">Заказ №{r.order_id}</span>
                                        <Stars value={r.rating} />
                                    </div>
                                    {r.comment && <p className="ur-card__comment">"{r.comment}"</p>}
                                    <span className="ur-card__date">
                                        {new Date(r.rating_date).toLocaleDateString('ru-RU')}
                                    </span>
                                </div>
                                <button
                                    className="ur-delete-btn"
                                    onClick={() => deleteOrderRating(r.id)}
                                    title="Удалить оценку"
                                >
                                    🗑
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="ur-section">
                <h2 className="ur-section-title">
                    Оценки услуг
                    <span className="ur-count">{serviceRatings.length}</span>
                </h2>
                {serviceRatings.length === 0 ? (
                    <p className="ur-empty">Нет оценок услуг.</p>
                ) : (
                    <div className="ur-list">
                        {serviceRatings.map(r => (
                            <div key={r.id} className="ur-card">
                                <div className="ur-card__info">
                                    <div className="ur-card__top">
                                        <span className="ur-card__label">Услуга №{r.service_id}</span>
                                        <Stars value={r.rating} />
                                    </div>
                                    {r.comment && <p className="ur-card__comment">"{r.comment}"</p>}
                                    <span className="ur-card__date">
                                        {new Date(r.review_date).toLocaleDateString('ru-RU')}
                                    </span>
                                </div>
                                <button
                                    className="ur-delete-btn"
                                    onClick={() => deleteServiceRating(r.id)}
                                    title="Удалить оценку"
                                >
                                    🗑
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default UserRatingsPage;
