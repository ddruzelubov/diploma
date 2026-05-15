import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { setAuthToken } from '../api/api';
import '../page_styles/OrderServicePage.css';

const OrderServicePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, serviceId, basePrice } = location.state || {};

    const [area, setArea] = useState('');
    const [address, setAddress] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);
    const debounceRef = useRef(null);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleAreaChange = (e) => {
        const val = e.target.value;
        setArea(val);
        setTotalPrice(basePrice * val);
    };

    const handleAddressChange = (e) => {
        const val = e.target.value;
        setAddress(val);
        clearTimeout(debounceRef.current);

        if (val.length < 3) {
            setSuggestions([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            setAddressLoading(true);
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5&addressdetails=1&accept-language=ru`,
                    { headers: { 'Accept-Language': 'ru' } }
                );
                const data = await res.json();
                setSuggestions(data.map(p => ({
                    id: p.place_id,
                    label: p.display_name,
                })));
                setShowSuggestions(true);
            } catch {
                setSuggestions([]);
            } finally {
                setAddressLoading(false);
            }
        }, 400);
    };

    const selectSuggestion = (label) => {
        setAddress(label);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!userId || !serviceId || !area || !address) {
            setError('Все поля обязательны для заполнения.');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Пожалуйста, войдите в систему.');
            return;
        }
        setAuthToken(token);
        setSubmitting(true);
        try {
            await api.post('/orders', {
                user_id: userId,
                service_id: serviceId,
                area,
                total_price: totalPrice,
                address,
                order_date: new Date()
            });
            navigate('/orders');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка при оформлении заказа.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="osp-page">
            <div className="osp-card">
                <div className="osp-header">
                    <button className="osp-back" onClick={() => navigate(-1)}>← Назад</button>
                    <h1>Оформить заказ</h1>
                    <p className="osp-sub">Укажите площадь и адрес — система рассчитает стоимость.</p>
                </div>

                {error && <p className="osp-error">{error}</p>}

                <form className="osp-form" onSubmit={handleSubmit}>
                    <label className="osp-field">
                        <span>Площадь (м²)</span>
                        <input
                            type="number"
                            value={area}
                            onChange={handleAreaChange}
                            required
                            min="1"
                            placeholder="Например, 45"
                        />
                    </label>

                    <div className="osp-field" ref={wrapperRef}>
                        <span>Адрес уборки</span>
                        <div className="osp-addr-wrap">
                            <input
                                type="text"
                                value={address}
                                onChange={handleAddressChange}
                                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                required
                                placeholder="Начните вводить адрес…"
                                autoComplete="off"
                            />
                            {addressLoading && <span className="osp-addr-spinner" />}
                        </div>
                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="osp-suggestions">
                                {suggestions.map(s => (
                                    <li key={s.id} onMouseDown={() => selectSuggestion(s.label)}>
                                        📍 {s.label}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {area > 0 && (
                        <div className="osp-price-box">
                            <span className="osp-price-label">Итоговая стоимость</span>
                            <span className="osp-price-value">{totalPrice.toFixed(2)} ₽</span>
                            <span className="osp-price-hint">{basePrice} ₽/м² × {area} м²</span>
                        </div>
                    )}

                    <button type="submit" className="osp-submit" disabled={submitting}>
                        {submitting ? 'Оформление…' : 'Подтвердить заказ'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OrderServicePage;
