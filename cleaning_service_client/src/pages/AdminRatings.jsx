import React, { useEffect, useState } from 'react';
import api from '../api/api';
import '../page_styles/AdminRatings.css';

const StarDisplay = ({ rating }) => (
    <div className="stars">
        {[1, 2, 3, 4, 5].map(s => (
            <span key={s} className={`star ${s <= rating ? 'star--filled' : 'star--empty'}`}>★</span>
        ))}
    </div>
);

const AdminRatings = () => {
    const [orderRatings, setOrderRatings] = useState([]);
    const [serviceRatings, setServiceRatings] = useState([]);
    const [error, setError] = useState('');
    const [tab, setTab] = useState('orders');

    useEffect(() => {
        const token = localStorage.getItem('token');
        Promise.all([
            api.get('/ratings'),
            api.get('/reviews/all', { headers: { Authorization: `Bearer ${token}` } })
        ]).then(([orderRes, serviceRes]) => {
            setOrderRatings(orderRes.data);
            setServiceRatings(serviceRes.data);
        }).catch(err => {
            setError('Не удалось загрузить отзывы: ' + err.message);
        });
    }, []);

    const deleteRating = async (id, isOrder) => {
        try {
            if (isOrder) {
                await api.delete(`/ratings/${id}`);
                setOrderRatings(prev => prev.filter(r => r.id !== id));
            } else {
                await api.delete(`/reviews/${id}`);
                setServiceRatings(prev => prev.filter(r => r.id !== id));
            }
        } catch (err) {
            setError('Не удалось удалить: ' + err.message);
        }
    };

    const current = tab === 'orders' ? orderRatings : serviceRatings;
    const isOrder = tab === 'orders';

    return (
        <div className="ar-page">
            <div className="ar-header">
                <h1>Отзывы и оценки</h1>
                <p className="ar-sub">Управляйте всеми отзывами клиентов.</p>
            </div>

            {error && <p className="ar-error">{error}</p>}

            <div className="ar-tabs">
                <button
                    className={`ar-tab ${tab === 'orders' ? 'ar-tab--active' : ''}`}
                    onClick={() => setTab('orders')}
                >
                    Оценки заказов
                    <span className="ar-tab-count">{orderRatings.length}</span>
                </button>
                <button
                    className={`ar-tab ${tab === 'services' ? 'ar-tab--active' : ''}`}
                    onClick={() => setTab('services')}
                >
                    Оценки услуг
                    <span className="ar-tab-count">{serviceRatings.length}</span>
                </button>
            </div>

            {current.length === 0 ? (
                <div className="ar-empty">
                    <span className="ar-empty__icon">⭐</span>
                    <p>Нет {isOrder ? 'оценок заказов' : 'оценок услуг'}.</p>
                </div>
            ) : (
                <div className="ar-list">
                    {current.map(rating => (
                        <div key={rating.id} className="ar-card">
                            <div className="ar-card__left">
                                <StarDisplay rating={rating.rating} />
                                {rating.comment && (
                                    <p className="ar-card__comment">"{rating.comment}"</p>
                                )}
                            </div>
                            <div className="ar-card__meta">
                                <span className="ar-card__ref">
                                    {isOrder
                                        ? `Заказ #${rating.order_id}`
                                        : `Услуга #${rating.service_id}`}
                                </span>
                                <span className="ar-card__date">
                                    {new Date(isOrder ? rating.rating_date : rating.review_date)
                                        .toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                <span className="ar-card__score">{rating.rating}/5</span>
                            </div>
                            <button
                                className="ar-delete-btn"
                                onClick={() => deleteRating(rating.id, isOrder)}
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

export default AdminRatings;
