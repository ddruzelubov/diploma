import React, { useEffect, useState } from 'react';
import api from '../api/api';
import '../page_styles/OrderRatings.css';

const StarDisplay = ({ rating }) => (
    <div className="stars" aria-label={`Оценка ${rating} из 5`}>
        {[1, 2, 3, 4, 5].map(s => (
            <span key={s} className={`star ${s <= rating ? 'star--filled' : 'star--empty'}`}>★</span>
        ))}
    </div>
);

const OrderRatings = () => {
    const [ratings, setRatings] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/ratings')
            .then(r => setRatings(r.data))
            .catch(() => setError('Нет оценок для выполненных заказов.'))
            .finally(() => setLoading(false));
    }, []);

    const avg = ratings.length
        ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1)
        : null;

    return (
        <div className="ratings-page">
            <div className="ratings-hero">
                <h1>Оценки заказов</h1>
                <p className="ratings-sub">Мнения клиентов о выполненных уборках</p>
                {avg && (
                    <div className="ratings-avg">
                        <span className="ratings-avg__num">{avg}</span>
                        <StarDisplay rating={Math.round(avg)} />
                        <span className="ratings-avg__count">{ratings.length} отзыв{ratings.length > 1 ? 'ов' : ''}</span>
                    </div>
                )}
            </div>

            {loading && <p className="ratings-loading">Загрузка…</p>}
            {error && <p className="ratings-error">{error}</p>}

            {!loading && !error && ratings.length === 0 && (
                <div className="ratings-empty">
                    <span className="ratings-empty__icon">⭐</span>
                    <p>Пока нет оценок.</p>
                </div>
            )}

            <div className="ratings-grid">
                {ratings.map(rating => (
                    <article key={rating.id} className="rating-card">
                        <div className="rating-card__top">
                            <StarDisplay rating={rating.rating} />
                            <span className="rating-card__date">
                                {new Date(rating.rating_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        <h3 className="rating-card__service">
                            {rating.order?.service?.name || 'Клининговая услуга'}
                        </h3>
                        {rating.comment && (
                            <p className="rating-card__comment">"{rating.comment}"</p>
                        )}
                        <div className="rating-card__footer">
                            <span className="rating-card__score-badge">{rating.rating}/5</span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default OrderRatings;
