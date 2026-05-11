import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import api, { setAuthToken } from "../api/api"; 
import '../page_styles/OrderServicePage.css'; 

const OrderServicePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, serviceId, basePrice } = location.state || {}; 
    const [error, setError] = useState('');

    const [area, setArea] = useState(''); 
    const [address, setaddress] = useState('');
    const [totalPrice, setTotalPrice] = useState(0); 

    const handleAreaChange = (e) => {
        const areaValue = e.target.value;
        setArea(areaValue);
        const calculatedPrice = basePrice * areaValue;
        setTotalPrice(calculatedPrice);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId || !serviceId || !area || !address) {
            setError('Ошибка: все поля должны быть заполнены.');
            return;
        }
    
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Ошибка: токен не найден. Пожалуйста, войдите в систему.');
            return;
        }
        setAuthToken(token);
    
        try {
            const response = await api.post('/orders', {
                user_id: userId, 
                service_id: serviceId, 
                area,
                total_price: totalPrice, 
                address,
                order_date: new Date()
            });
    
            if (response.status === 201) {
                setArea('');
                setaddress('');
                setTotalPrice(0);
                navigate('/orders');
            } else {
                const errorData = await response.data;
                setError(errorData.message || 'Произошла ошибка при заказе услуги.');
            }
        } catch (error) {
            console.error('Ошибка при заказе услуги:', error.response ? error.response.data : error);
            setError('Произошла ошибка при соединении с сервером.');
        }
    };

    return (
        <div className="order-service-page">
            <h1>Заказать услугу</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Площадь (в кв. м):
                    <input
                        type="number"
                        value={area}
                        onChange={handleAreaChange}
                        required
                        min="0" 
                    />
                </label>
                <br />
                <label>
                    Адрес:
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setaddress(e.target.value)}
                        required
                    />
                </label>
                <br />
                <p>Итоговая цена: {totalPrice.toFixed(2)} $</p> 
                <button type="submit">Заказать</button>
            </form>
        </div>
    );
};

export default OrderServicePage;