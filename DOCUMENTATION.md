# CleanSpace — Система управления клининговым сервисом
## Техническая документация приложения

---

## 1. Общее описание системы

**CleanSpace** — это веб-приложение для управления клининговым сервисом, реализованное в виде трёхуровневой клиент-серверной системы. Приложение обеспечивает полный цикл взаимодействия между клиентами, клинерами и администраторами: от оформления заявки на уборку до оплаты и оценки выполненного заказа.

Система реализована как многоуровневое приложение (multi-tier architecture) с разделением на:
- **Клиентская часть** (Frontend) — React SPA
- **Серверная часть** (Backend API) — Node.js/Express REST API
- **Почтовый микросервис** (Email Service) — отдельный Express-сервер для рассылки уведомлений

---

## 2. Стек технологий

### 2.1 Frontend (Клиентская часть)

| Технология | Версия | Назначение |
|---|---|---|
| **React** | 18.x | Основной UI-фреймворк (компонентная модель, хуки) |
| **React Router DOM** | 7.x | Клиентская маршрутизация (SPA-навигация) |
| **Axios** | 1.x | HTTP-клиент для обращения к REST API |
| **jwt-decode** | 4.x | Декодирование JWT-токенов на стороне клиента |
| **react-scripts (CRA)** | 5.x | Сборщик (Webpack под капотом), dev-сервер, Babel |
| **CSS Modules / Global CSS** | — | Стилизация компонентов |

### 2.2 Backend (Серверная часть)

| Технология | Версия | Назначение |
|---|---|---|
| **Node.js** | 20.x | Среда выполнения JavaScript на сервере |
| **Express** | 4.x | HTTP-фреймворк, маршрутизация, middleware |
| **Sequelize** | 6.x | ORM для работы с реляционной БД (PostgreSQL) |
| **PostgreSQL** | 16 | Основная реляционная база данных |
| **Mongoose** | 8.x | ODM для работы с MongoDB |
| **MongoDB** | — | База данных для логирования HTTP-запросов и операций |
| **Passport.js** | 0.7.x | Middleware аутентификации |
| **passport-jwt** | 4.x | JWT-стратегия для Passport |
| **jsonwebtoken** | 9.x | Генерация и верификация JWT-токенов |
| **bcrypt / bcryptjs** | 5.x / 2.x | Хэширование паролей |
| **express-validator** | 7.x | Валидация входящих данных в маршрутах |
| **Joi** | 17.x | Дополнительная схемная валидация |
| **Morgan** | 1.x | HTTP-логирование запросов |
| **CORS** | 2.x | Управление политикой Cross-Origin |
| **dotenv** | 16.x | Управление переменными окружения |
| **swagger-jsdoc** | 6.x | Генерация OpenAPI-спецификации из JSDoc |
| **swagger-ui-express** | 5.x | Интерактивная документация API (Swagger UI) |
| **amqplib** | 0.10.x | Клиент RabbitMQ (зависимость установлена) |

### 2.3 Email-сервис (Микросервис уведомлений)

| Технология | Версия | Назначение |
|---|---|---|
| **Node.js** | 20.x | Среда выполнения |
| **Express** | 4.x | HTTP-сервер для приёма запросов на отправку писем |
| **Nodemailer** | 6.x | Библиотека отправки email через SMTP (Gmail) |

### 2.4 Инфраструктура и среда

| Технология | Назначение |
|---|---|
| **Replit** | Облачная среда разработки и хостинга |
| **NixOS (stable-25_05)** | Базовая операционная система контейнера |
| **PostgreSQL 16** | Managed-база данных Replit |
| **Git** | Система контроля версий |

---

## 3. Архитектура системы

### 3.1 Общая схема взаимодействия

```
┌──────────────────────────────────┐
│   Браузер пользователя           │
│   React SPA (порт 5000)          │
│   - axios → /api/*               │
└─────────────┬────────────────────┘
              │ HTTP (proxy)
              ▼
┌──────────────────────────────────┐
│   Express API Server (порт 3001) │
│   - Passport JWT middleware       │
│   - Routes → Controllers         │
│   - Services → Repositories      │
│   - Sequelize ORM → PostgreSQL   │
│   - Mongoose → MongoDB (логи)    │
└──────┬─────────────┬─────────────┘
       │             │
       ▼             ▼
┌────────────┐  ┌──────────────────┐
│ PostgreSQL │  │  Email Service   │
│ (основная  │  │  (порт 5001)     │
│  БД)       │  │  Nodemailer →    │
└────────────┘  │  Gmail SMTP      │
                └──────────────────┘
```

### 3.2 Архитектурный паттерн Backend

Серверная часть построена по паттерну **Controller → Service → Repository**:

- **Controller** — принимает HTTP-запрос, вызывает Service, возвращает ответ
- **Service** — содержит бизнес-логику, валидирует данные, оркестрирует репозитории
- **Repository** — инкапсулирует запросы к БД через Sequelize/Mongoose

---

## 4. Структура проекта

```
workspace/
├── cleaning_service_client/       # React SPA
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── api.js             # Axios-инстанс, setAuthToken
│       ├── components/
│       │   ├── AdminPanel.jsx     # Панель навигации администратора
│       │   ├── CleanerPanel.jsx   # Панель навигации клинера
│       │   ├── NavBar.jsx         # Основная навигационная панель
│       │   ├── StarRating.jsx     # Компонент звёздного рейтинга
│       │   └── StatusBadge.jsx    # Компонент бейджа статуса заказа
│       ├── pages/
│       │   ├── HomePage.jsx       # Главная страница
│       │   ├── Login.jsx          # Страница входа
│       │   ├── Register.jsx       # Страница регистрации
│       │   ├── ProfilePage.jsx    # Личный кабинет пользователя
│       │   ├── ServiceList.jsx    # Каталог услуг
│       │   ├── OrderServicePage.jsx  # Страница оформления заказа
│       │   ├── OrdersPage.jsx     # Список заказов пользователя
│       │   ├── PaymentPage.jsx    # Страница оплаты заказа
│       │   ├── PaymentHistoryPage.jsx # История платежей
│       │   ├── OrderRatingPage.jsx   # Страница оценки заказа
│       │   ├── OrderRatings.jsx   # Список оценок заказов
│       │   ├── ServiceRatings.jsx # Отзывы на услуги
│       │   ├── ServiceRatingsPage.jsx # Страница отзывов
│       │   ├── UserRatingsPage.jsx   # Оценки пользователя
│       │   ├── UserList.jsx       # Список пользователей (admin)
│       │   ├── CleanerOrders.jsx  # Заказы клинера
│       │   ├── AdminOrders.jsx    # Управление заказами (admin)
│       │   ├── AdminServices.jsx  # Управление услугами (admin)
│       │   ├── AdminCleaners.jsx  # Управление клинерами (admin)
│       │   └── AdminRatings.jsx   # Просмотр оценок (admin)
│       └── page_styles/           # CSS-файлы для каждой страницы
│
├── cleaning_service_server/       # Express API
│   ├── app.js                     # Точка входа, инициализация Express
│   ├── config/
│   │   ├── database.js            # Настройка Sequelize + PostgreSQL
│   │   ├── mongo.js               # Подключение к MongoDB
│   │   └── init_db.sql            # SQL-схема базы данных
│   ├── controllers/               # HTTP-контроллеры
│   ├── services/                  # Бизнес-логика
│   ├── repositories/              # Слой доступа к данным
│   ├── models/                    # Sequelize/Mongoose модели
│   ├── middleware/
│   │   ├── auth.js                # Middleware ролевой авторизации
│   │   ├── passport.js            # JWT-стратегия Passport
│   │   ├── errorHandler.js        # Глобальный обработчик ошибок
│   │   ├── httpLogger.js          # Логирование HTTP в MongoDB
│   │   └── dbLogger.js            # Логирование DB-операций
│   ├── routes/
│   │   └── index.js               # Все API-маршруты
│   ├── validators/                # express-validator схемы
│   ├── utils/
│   │   ├── emailPublisher.js      # HTTP-вызов email-сервиса
│   │   └── emailTemplates.js      # HTML-шаблоны писем
│   └── documentation/
│       └── swagger.js             # OpenAPI/Swagger конфигурация
│
├── email-server/                  # Email-микросервис
│   └── index.js                   # Express + Nodemailer
│
├── start.sh                       # Скрипт запуска всех сервисов
└── .replit                        # Конфигурация Replit
```

---

## 5. База данных

### 5.1 Реляционная БД — PostgreSQL

Основная база данных хранит все бизнес-данные системы.

#### Схема таблиц

**Таблица `users` — Пользователи**
```sql
CREATE TABLE users (
    id       SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email    VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,          -- bcrypt-хэш
    role     VARCHAR(20)  NOT NULL DEFAULT 'user'  -- user | cleaner | admin
);
```

**Таблица `services` — Услуги**
```sql
CREATE TABLE services (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL,
    description TEXT            NOT NULL,
    base_price  NUMERIC(10, 2)  NOT NULL     -- цена за 1 м²
);
```

**Таблица `orders` — Заказы**
```sql
CREATE TABLE orders (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
    service_id      INTEGER REFERENCES services(id) ON DELETE CASCADE,
    cleaner_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
    area            NUMERIC(10, 2) NOT NULL,
    total_price     NUMERIC(10, 2) NOT NULL,  -- base_price × area
    address         TEXT           NOT NULL,
    status          VARCHAR(50)    NOT NULL DEFAULT 'pending',
    order_date      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP
);
```

**Таблица `payments` — Платежи**
```sql
CREATE TABLE payments (
    id             SERIAL PRIMARY KEY,
    order_id       INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    user_id        INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount         NUMERIC(10, 2) NOT NULL,
    status         VARCHAR(20)    NOT NULL DEFAULT 'paid',
    payment_method VARCHAR(50)    DEFAULT 'card',
    transaction_id VARCHAR(100),             -- UUID транзакции
    created_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);
```

**Таблица `reviews` — Отзывы на услуги**
```sql
CREATE TABLE reviews (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    service_id  INTEGER REFERENCES services(id) ON DELETE CASCADE,
    rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

**Таблица `orderratings` — Оценки выполненных заказов**
```sql
CREATE TABLE orderratings (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
    order_id    INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    rating_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### 5.2 Жизненный цикл заказа (статусы)

```
pending → assigned → in_progress → completed
```

| Статус | Описание | Кто меняет |
|---|---|---|
| `pending` | Заказ создан, ожидает назначения | Система (при создании) |
| `assigned` | Назначен клинер | Администратор |
| `in_progress` | Уборка выполняется | Клинер |
| `completed` | Заказ завершён | Клинер |

### 5.3 Нереляционная БД — MongoDB

MongoDB используется исключительно для логирования. Хранит две коллекции:

- **HttpLog** — логи HTTP-запросов (метод, URL, статус-код, время ответа)
- **DbLog** — логи операций с БД (операция, коллекция, ID документа)

MongoDB является необязательным компонентом — при недоступности сервер продолжает работу, логирование просто отключается.

---

## 6. Аутентификация и авторизация

### 6.1 Механизм аутентификации

Система использует **stateless JWT-аутентификацию**:

1. Пользователь отправляет `POST /api/login` с email и паролем
2. Сервер верифицирует пароль через `bcrypt.compare()`
3. При успехе генерируется JWT-токен (`jsonwebtoken.sign()`) с полями `id`, `email`, `role`
4. Токен возвращается клиенту и сохраняется в `localStorage`
5. При каждом запросе токен передаётся в заголовке `Authorization: Bearer <token>`
6. Middleware `passport-jwt` извлекает и верифицирует токен

### 6.2 Роли пользователей

| Роль | Описание | Доступные функции |
|---|---|---|
| `user` | Обычный клиент | Создание заказов, оплата, оценка, просмотр истории |
| `cleaner` | Сотрудник-клинер | Просмотр назначенных заказов, смена статуса (→ completed) |
| `admin` | Администратор | Полный доступ: управление пользователями, услугами, заказами, клинерами |

### 6.3 Middleware авторизации

```javascript
// Использование: auth() — любой авторизованный
//                auth(['admin']) — только администратор
//                auth(['admin', 'cleaner']) — admin или cleaner
router.delete('/orders/:id', auth(), OrderController.deleteOrder);
router.put('/orders/:id/assign-cleaner', auth(['admin']), OrderController.assignCleaner);
```

---

## 7. REST API

Базовый URL: `/api`

Интерактивная документация доступна по адресу: `http://localhost:3001/api-docs` (Swagger UI)

### 7.1 Аутентификация

| Метод | URL | Доступ | Описание |
|---|---|---|---|
| POST | `/api/register` | Публичный | Регистрация нового пользователя |
| POST | `/api/login` | Публичный | Вход, получение JWT-токена |
| GET | `/api/users/me` | Авторизован | Профиль текущего пользователя |
| PUT | `/api/users/me` | Авторизован | Обновление профиля |

### 7.2 Услуги (Services)

| Метод | URL | Доступ | Описание |
|---|---|---|---|
| GET | `/api/services` | Публичный | Список всех услуг |
| POST | `/api/services` | Admin | Создание услуги |
| PUT | `/api/services/:id` | Admin | Редактирование услуги |
| DELETE | `/api/services/:id` | Admin | Удаление услуги |

### 7.3 Заказы (Orders)

| Метод | URL | Доступ | Описание |
|---|---|---|---|
| POST | `/api/orders` | User | Создание заказа |
| GET | `/api/orders` | User | Заказы текущего пользователя |
| GET | `/api/orders/all` | Admin | Все заказы системы |
| GET | `/api/cleaner/orders` | Cleaner | Заказы, назначенные клинеру |
| GET | `/api/orders/:id` | Авторизован | Детали заказа |
| PUT | `/api/orders/:id/assign-cleaner` | Admin | Назначение клинера |
| PUT | `/api/orders/:id` | Admin/User/Cleaner | Обновление статуса или данных |
| DELETE | `/api/orders/:id` | Авторизован | Отмена заказа (только неоплаченные) |

### 7.4 Платежи (Payments)

| Метод | URL | Доступ | Описание |
|---|---|---|---|
| POST | `/api/payments` | User | Оплата заказа |
| GET | `/api/payments` | User | История платежей пользователя |
| GET | `/api/admin/payments` | Admin | Все платежи системы |
| GET | `/api/orders/:orderId/payment` | Авторизован | Платёж по конкретному заказу |

### 7.5 Отзывы на услуги (Reviews)

| Метод | URL | Доступ | Описание |
|---|---|---|---|
| POST | `/api/reviews` | User | Создание отзыва |
| GET | `/api/reviews` | User | Отзывы текущего пользователя |
| GET | `/api/reviews/all` | Admin | Все отзывы |
| GET | `/api/reviews/:serviceId` | Публичный | Отзывы на конкретную услугу |
| PUT | `/api/reviews/:id` | User | Редактирование отзыва |
| DELETE | `/api/reviews/:id` | User | Удаление отзыва |

### 7.6 Оценки заказов (OrderRatings)

| Метод | URL | Доступ | Описание |
|---|---|---|---|
| POST | `/api/orders/:orderId/ratings` | User | Оценка выполненного заказа |
| GET | `/api/userRatings` | User | Оценки текущего пользователя |
| GET | `/api/ratings` | Публичный | Все оценки |
| PUT | `/api/ratings/:id` | User | Редактирование оценки |
| DELETE | `/api/ratings/:id` | User | Удаление оценки |

### 7.7 Администрирование

| Метод | URL | Доступ | Описание |
|---|---|---|---|
| GET | `/api/users` | Admin | Список всех пользователей |
| DELETE | `/api/user/:id` | Admin | Удаление пользователя |
| GET | `/api/cleaners` | Admin | Список клинеров |
| POST | `/api/cleaners` | Admin | Создание аккаунта клинера |

---

## 8. Email-уведомления

Система отправляет HTML-письма через отдельный микросервис при следующих событиях:

| Событие | Тема письма |
|---|---|
| Регистрация | «Добро пожаловать в CleanSpace» |
| Создание заказа | «Заказ №N оформлен — CleanSpace» |
| Оплата заказа | «Чек об оплате заказа №N — CleanSpace» |
| Завершение заказа | «Заказ №N выполнен — CleanSpace» |

### Взаимодействие сервисов

```
API Server → POST http://127.0.0.1:5001/send → Email Service → Gmail SMTP
```

Email-сервис принимает JSON: `{ to, subject, text, html }` и отправляет письмо через Nodemailer. Транспорт — Gmail с App Password.

---

## 9. Интерфейс пользователя

### 9.1 Страницы и их функции

**Публичные страницы (без авторизации):**
- **Главная** (`/`) — лендинг с описанием сервиса, статистикой, схемой работы
- **Каталог услуг** (`/services`) — список доступных услуг с ценами
- **Отзывы на услугу** (`/services/:id/reviews`) — отзывы клиентов

**Страницы для клиентов (`role: user`):**
- **Оформление заказа** (`/order/:serviceId`) — выбор адреса, площади, даты
- **Мои заказы** (`/orders`) — список заказов со статусами, оплатой, отменой
- **Оплата** (`/payment/:orderId`) — оплата заказа (карта / банковский перевод)
- **История платежей** (`/payments`) — все транзакции пользователя
- **Оценка заказа** (`/order-rating/:orderId`) — оценка (1–5 звёзд) + комментарий
- **Мои оценки** (`/my-ratings`) — история оценок пользователя
- **Профиль** (`/profile`) — редактирование имени, email, пароля

**Страницы для клинеров (`role: cleaner`):**
- **Заказы клинера** (`/cleaner/orders`) — назначенные заказы, смена статуса

**Страницы для администратора (`role: admin`):**
- **Управление заказами** (`/admin/orders`) — все заказы, назначение клинеров
- **Управление услугами** (`/admin/services`) — CRUD услуг
- **Управление клинерами** (`/admin/cleaners`) — создание и удаление аккаунтов клинеров
- **Все оценки** (`/admin/ratings`) — просмотр всех оценок заказов
- **Список пользователей** (`/admin/users`) — управление пользователями

### 9.2 Общие UI-компоненты

- **NavBar** — адаптивная навигация с учётом роли пользователя
- **AdminPanel / CleanerPanel** — панели с ссылками для соответствующих ролей
- **StatusBadge** — цветной бейдж статуса заказа
- **StarRating** — интерактивный компонент выбора оценки (1–5 звёзд)

---

## 10. Валидация данных

### Серверная валидация

Используется двухуровневая валидация:

1. **express-validator** — проверка входящих HTTP-запросов по полям:
   - Обязательность полей
   - Форматы (email, числа, строки)
   - Диапазоны значений

2. **Joi** — схемная валидация в сервисном слое

### Примеры правил валидации

| Поле | Правило |
|---|---|
| `email` | Валидный email-адрес, уникальный в системе |
| `password` | Минимум 6 символов |
| `area` | Число > 0 |
| `rating` | Целое число от 1 до 5 |
| `status` | Один из: `pending`, `assigned`, `in_progress`, `completed` |

---

## 11. Бизнес-логика

### 11.1 Расчёт стоимости заказа

```
total_price = service.base_price × area
```

Цена пересчитывается автоматически при изменении площади заказа.

### 11.2 Оплата заказа

- Каждый заказ может быть оплачен только один раз
- Нельзя оплатить уже завершённый заказ
- При оплате генерируется UUID транзакции (`crypto.randomUUID()`)
- Поддерживаемые методы: `card` (банковская карта), `bank_transfer` (банковский перевод)
- Платёжная система является симулированной (без реального эквайринга)

### 11.3 Отмена заказа

- Отмена доступна только для заказов в статусе `pending`
- Нельзя отменить оплаченный заказ
- Кнопка «Отменить» скрыта в UI для оплаченных заказов

### 11.4 Завершение заказа

- Статус `completed` может установить только клинер
- При завершении фиксируется `completion_date`
- Пользователь получает email-уведомление
- После завершения заказа пользователю доступна функция оценки

### 11.5 Назначение клинера

- Назначение выполняет только администратор
- При назначении статус заказа автоматически меняется на `assigned`

---

## 12. Безопасность

| Мера | Реализация |
|---|---|
| Хэширование паролей | bcrypt (salt rounds = 10) |
| Аутентификация | JWT Bearer Token (HS256) |
| Авторизация | Middleware с проверкой ролей |
| Валидация входных данных | express-validator на всех POST/PUT |
| CORS | Настроен разрешительно (origin: true, credentials: true) |
| Секреты | Переменные окружения, не хранятся в коде |
| SQL-инъекции | Защита через Sequelize ORM (параметризованные запросы) |

---

## 13. Конфигурация и переменные окружения

| Переменная | Где используется | Описание |
|---|---|---|
| `DATABASE_URL` | API Server | Строка подключения к PostgreSQL |
| `JWT_SECRET` | API Server | Секрет для подписи JWT-токенов |
| `PORT` | API Server | Порт сервера (по умолчанию 3001) |
| `EMAIL_USER` | Email Service | Gmail-адрес для отправки писем |
| `EMAIL_PASS` | Email Service | App Password Gmail |
| `EMAIL_SERVICE_URL` | API Server | URL email-сервиса (http://127.0.0.1:5001) |

---

## 14. Запуск приложения

Все три сервиса запускаются одновременно через `start.sh`:

```bash
#!/bin/bash
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 1. Запуск email-микросервиса (порт 5001)
cd "$ROOT_DIR/email-server" && node index.js &

# 2. Запуск API-сервера (порт 3001)
cd "$ROOT_DIR/cleaning_service_server" && node app.js &

sleep 3

# 3. Запуск React dev-сервера (порт 5000)
cd "$ROOT_DIR/cleaning_service_client" && PORT=5000 HOST=0.0.0.0 \
    DANGEROUSLY_DISABLE_HOST_CHECK=true npx react-scripts start
```

### Порты

| Сервис | Порт | Назначение |
|---|---|---|
| React SPA | 5000 | Пользовательский интерфейс (внешний порт 80) |
| API Server | 3001 | REST API (внешний порт 3001) |
| Email Service | 5001 | Микросервис email (внутренний) |

---

## 15. Установка зависимостей

```bash
# API-сервер
cd cleaning_service_server && npm install

# Email-микросервис
cd email-server && npm install

# React-клиент
cd cleaning_service_client && npm install
```

---

## 16. Тестирование

Серверная часть использует **Jest** для юнит-тестов:

```bash
cd cleaning_service_server && npm test
```

---

## 17. API-документация (Swagger)

После запуска сервера интерактивная документация доступна по адресу:

```
http://localhost:3001/api-docs
```

Реализована с помощью `swagger-jsdoc` (генерация OpenAPI 3.0 спецификации из JSDoc-аннотаций) и `swagger-ui-express` (рендеринг Swagger UI).
