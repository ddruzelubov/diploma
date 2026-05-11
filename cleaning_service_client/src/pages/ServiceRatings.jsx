import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import "../page_styles/ServiceRatings.css";

const ServiceRatings = () => {
    const { serviceId } = useParams();
    const [reviews, setRatings] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const response = await api.get(`/reviews/${serviceId}`); 
                setRatings(response.data);
            } catch (error) {
                console.error('Error fetching ratings:', error);
                setError('Нет оценок для этой услуги.');
            }
        };

        fetchRatings();
    }, [serviceId]);

    return (
        <div className='service-ratings'>
            <h1>Оценки услуги</h1>
            {error ? <p>{error}</p>:
            <ul>
                {
                reviews.map(review => (
                    <li key={review.id}>
                        <p>Оценка: {review.rating}</p>
                        {review.comment && <p>Комментарий: {review.comment}</p>}
                    </li>
                ))
                }
            </ul>}
        </div>
    );
};

export default ServiceRatings;