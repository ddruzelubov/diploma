import React, { useEffect, useState } from 'react';
import api from '../api/api';
import '../page_styles/ServiceList.css';

const AdminServices = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState('');
    const [newService, setNewService] = useState({ name: '', description: '', base_price: '' });
    const [editingService, setEditingService] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/services');
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
                setError('Не удалось загрузить услуги.');
            }
        };

        fetchServices();
    }, []);

    const handleAddService = async () => {
        const token = localStorage.getItem('token'); 
        try {
            const response = await api.post('/services', {
                name: newService.name,
                description: newService.description,
                base_price: parseFloat(newService.base_price) 
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setServices([...services, response.data]);
            setNewService({ name: '', description: '', base_price: '' });
            setError('');
        } catch (error) {
            console.error('Error adding service:', error);
            setError('Не удалось добавить услугу.');
        }
    };

    const handleEditService = (service) => {
        setEditingService(service);
        setNewService({ name: service.name, description: service.description, base_price: service.base_price.toString() }); 
    };

    const handleUpdateService = async () => {
        const token = localStorage.getItem('token'); 
        try {
            const response = await api.put(`/services/${editingService.id}`, {
                name: newService.name,
                description: newService.description,
                base_price: Number(newService.base_price) 
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setServices(services.map(service => (service.id === editingService.id ? response.data : service)));
            setNewService({ name: '', description: '', base_price: '' });
            setEditingService(null);
            setError('');
        } catch (error) {
            console.error('Error updating service:', error);
            setError('Не удалось обновить услугу.');
        }
    };

    const handleDeleteService = async (id) => {
        const token = localStorage.getItem('token'); 
        try {
            await api.delete(`/services/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setServices(services.filter(service => service.id !== id));
        } catch (error) {
            console.error('Error deleting service:', error);
            setError('Не удалось удалить услугу.');
        }
    };

    return (
        <div className="service-list-page">
            <h1>Услуги</h1>
            {error && <p className="error">{error}</p>}
            <div className="service-form">
                <h2>{editingService ? 'Редактировать услугу' : 'Добавить новую услугу'}</h2>
                <input
                    type="text"
                    placeholder="Название услуги"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Описание услуги"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Цена"
                    value={newService.base_price}
                    onChange={(e) => setNewService({ ...newService, base_price: e.target.value })}
                    required
                />
                <button onClick={editingService ? handleUpdateService : handleAddService}>
                    {editingService ? 'Обновить услугу' : 'Добавить услугу'}
                </button>
            </div>
            <h2>Список услуг</h2>
            <ul>
                {services.map(service => (
                    <li key={service.id}>
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                        <p>Цена: {service.base_price} $</p>
                        <button onClick={() => handleEditService(service)}>Редактировать</button>
                        <button onClick={() => handleDeleteService(service.id)}>Удалить</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminServices;