CREATE DATABASE cleaning_service;
\c cleaning_service;

-- Создание таблицы Users
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы Services
CREATE TABLE Services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL
);

-- Создание таблицы Orders
CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id),
    service_id INTEGER REFERENCES Services(id),
    area NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    address VARCHAR(255) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP
);

-- Создание таблицы Reviews
CREATE TABLE Reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id),
    service_id INTEGER REFERENCES Services(id),
    rating INTEGER NOT NULL,
    comment TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы OrderRatings
CREATE TABLE OrderRatings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id),
    order_id INTEGER REFERENCES Orders(id),
    rating INTEGER NOT NULL,
    comment TEXT,
    rating_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

