import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../page_styles/ServiceList.css';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/services'); 
                console.log('Services fetched:', response.data);
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
                setError('Не удалось загрузить услуги.');
            }
        };

        fetchServices();
    }, []);

    const handleOrder = (serviceId, basePrice) => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Вы должны быть авторизованы для заказа услуги.');
            navigate('/login');
            return;
        }

        const userId = JSON.parse(atob(token.split('.')[1])).id;

        navigate('/order-service', { state: { userId, serviceId, basePrice } });
    };

    const handleViewRatings = (serviceId) => {
        navigate(`/service-ratings/${serviceId}`); 
    };

    const handleCreateReview = (serviceId) => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('Вы должны быть авторизованы для заказа услуги.');
            navigate('/login');
            return;
        }

        const userId = JSON.parse(atob(token.split('.')[1])).id;

        navigate(`/rating-service`, { state: { userId, serviceId }}); 
    };

    return (
        <div className="service-list-page">
            <h1>Каталог услуг</h1>
            <p className="service-lead">Выберите тип уборки, оформите заказ и оцените результат после визита.</p>
            {error && <p className="error">{error}</p>}
            <ul>
                {services.map(service => (
                    <li key={service.id}>
                        <h2>{service.name}</h2>
                        <p>{service.description}</p>
                        <p><strong>от {service.base_price} ₽</strong> за м²</p>
                        {service.averageRating !== undefined && ( 
                            <p>Средняя оценка: {service.averageRating} ★</p>
                        )}
                        <div className="service-list-actions">
                            <button type="button" onClick={() => handleOrder(service.id, service.base_price)}>Заказать</button>
                            <button type="button" onClick={() => handleViewRatings(service.id)}>Отзывы</button>
                            <button type="button" onClick={() => handleCreateReview(service.id)}>Оценить услугу</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ServiceList;