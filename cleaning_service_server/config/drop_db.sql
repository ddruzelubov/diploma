-- Подключение к базе данных postgres
\c postgres;

-- Завершение всех активных соединений с базой данных cleaning_service
REVOKE CONNECT ON DATABASE cleaning_service FROM PUBLIC;
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'cleaning_service';

-- Удаление базы данных
DROP DATABASE cleaning_service;
