import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../page_styles/ServiceList.css';

const SERVICE_ICONS = [
    { keywords: ['бассейн'], icon: '🏊' },
    { keywords: ['окн', 'стекл', 'витрин'], icon: '🪟' },
    { keywords: ['офис', 'корпоратив'], icon: '🏢' },
    { keywords: ['ковр', 'ковер'], icon: '🧶' },
    { keywords: ['гараж', 'автомобил'], icon: '🚗' },
    { keywords: ['сад', 'садов', 'патио', 'двор'], icon: '🌿' },
    { keywords: ['крыш', 'кровл'], icon: '🏚️' },
    { keywords: ['горничн', 'ежедневн'], icon: '🛎️' },
    { keywords: ['послерем', 'ремонт', 'строит'], icon: '🔨' },
    { keywords: ['водосток', 'трубопров'], icon: '💧' },
    { keywords: ['мебел', 'диван', 'обивк'], icon: '🛋️' },
    { keywords: ['гриль', 'барбекю'], icon: '🍖' },
    { keywords: ['генерал', 'глубок', 'полн', 'комплекс'], icon: '✨' },
];

const getIcon = (name) => {
    const n = name.toLowerCase();
    for (const { keywords, icon } of SERVICE_ICONS) {
        if (keywords.some(k => n.includes(k))) return icon;
    }
    return '🧹';
};

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/services')
            .then(r => setServices(r.data))
            .catch(() => setError('Не удалось загрузить услуги.'));
    }, []);

    const handleOrder = (serviceId, basePrice) => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        navigate('/order-service', { state: { userId, serviceId, basePrice } });
    };

    const handleViewRatings = (serviceId) => {
        navigate(`/service-ratings/${serviceId}`);
    };

    const handleCreateReview = (serviceId) => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        navigate('/rating-service', { state: { userId, serviceId } });
    };

    return (
        <div className="service-list-page">
            <div className="sl-header">
                <h1>Каталог услуг</h1>
                <p className="sl-lead">Выберите тип уборки, оформите заказ и оцените результат после визита.</p>
            </div>
            {error && <p className="sl-error">{error}</p>}
            <div className="sl-grid">
                {services.map(service => (
                    <div key={service.id} className="sl-card">
                        <div className="sl-card__icon-wrap">
                            <span className="sl-card__icon">{getIcon(service.name)}</span>
                        </div>
                        <div className="sl-card__body">
                            <h2 className="sl-card__name">{service.name}</h2>
                            <p className="sl-card__desc">{service.description}</p>
                            <div className="sl-card__meta-row">
                                <span className="sl-card__price">
                                    от <strong>{service.base_price} Br</strong>/м²
                                </span>
                                {service.averageRating !== undefined && (
                                    <span className="sl-card__rating">
                                        ★ {service.averageRating}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="sl-card__actions">
                            <button
                                type="button"
                                className="sl-btn sl-btn--primary"
                                onClick={() => handleOrder(service.id, service.base_price)}
                            >
                                Заказать
                            </button>
                            <button
                                type="button"
                                className="sl-btn sl-btn--ghost"
                                onClick={() => handleViewRatings(service.id)}
                            >
                                Отзывы
                            </button>
                            <button
                                type="button"
                                className="sl-btn sl-btn--accent"
                                onClick={() => handleCreateReview(service.id)}
                            >
                                Оценить
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {services.length === 0 && !error && (
                <p className="sl-empty">Загрузка услуг…</p>
            )}
        </div>
    );
};

export default ServiceList;
