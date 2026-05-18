// ─────────────────────────────────────────────
//  USERS
// ─────────────────────────────────────────────

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Регистрация и вход
 *   - name: Users
 *     description: Управление пользователями
 *   - name: Cleaners
 *     description: Управление клинерами
 *   - name: Services
 *     description: Услуги клининга
 *   - name: Orders
 *     description: Заказы
 *   - name: Payments
 *     description: Платежи и возвраты
 *   - name: Reviews
 *     description: Отзывы на услуги
 *   - name: Order Ratings
 *     description: Оценки выполненных заказов
 */

// ── Auth ──────────────────────────────────────

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Auth]
 *     summary: Регистрация нового пользователя
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: Иван Иванов
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ivan@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Пользователь успешно зарегистрирован
 *       400:
 *         description: Email уже зарегистрирован или ошибка валидации
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Auth]
 *     summary: Вход в систему — получение JWT-токена
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ivan@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [user, cleaner, admin]
 *                 token:
 *                   type: string
 *                   description: JWT Bearer токен
 *       400:
 *         description: Неверный email или пароль
 */

// ── Users (profile) ───────────────────────────

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Получить профиль текущего пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профиль пользователя (без пароля)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Не авторизован
 *   put:
 *     tags: [Users]
 *     summary: Обновить профиль (имя, email, пароль)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: Новое Имя
 *               email:
 *                 type: string
 *                 format: email
 *               currentPassword:
 *                 type: string
 *                 description: Обязателен при смене пароля
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Обновлённый профиль
 *       400:
 *         description: Ошибка валидации или неверный текущий пароль
 *       401:
 *         description: Не авторизован
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Список всех пользователей (только admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив пользователей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещён
 */

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Удалить пользователя по ID (только admin). Каскадно удаляет заказы, платежи и отзывы.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID пользователя
 *     responses:
 *       204:
 *         description: Пользователь удалён
 *       403:
 *         description: Нельзя удалить собственный аккаунт или доступ запрещён
 *       404:
 *         description: Пользователь не найден
 */

// ── Cleaners ──────────────────────────────────

/**
 * @swagger
 * /api/cleaners:
 *   get:
 *     tags: [Cleaners]
 *     summary: Список всех клинеров (только admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив клинеров
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 *                     example: cleaner
 *       403:
 *         description: Доступ запрещён
 *   post:
 *     tags: [Cleaners]
 *     summary: Создать аккаунт клинера (только admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: Мария Петрова
 *               email:
 *                 type: string
 *                 format: email
 *                 example: maria@cleanspace.by
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: Клинер успешно добавлен
 *       400:
 *         description: Email уже зарегистрирован или ошибка валидации
 *       403:
 *         description: Доступ запрещён
 */

// ── Services ──────────────────────────────────

/**
 * @swagger
 * /api/services:
 *   get:
 *     tags: [Services]
 *     summary: Список всех услуг со средним рейтингом (публичный)
 *     responses:
 *       200:
 *         description: Массив услуг
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   base_price:
 *                     type: number
 *                     description: Цена за 1 м²
 *                   averageRating:
 *                     type: number
 *   post:
 *     tags: [Services]
 *     summary: Создать услугу (только admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, base_price]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Генеральная уборка
 *               description:
 *                 type: string
 *               base_price:
 *                 type: number
 *                 example: 3.5
 *     responses:
 *       201:
 *         description: Услуга создана
 *       403:
 *         description: Доступ запрещён
 */

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     tags: [Services]
 *     summary: Обновить услугу по ID (только admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               base_price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Услуга обновлена
 *       403:
 *         description: Доступ запрещён
 *       404:
 *         description: Услуга не найдена
 *   delete:
 *     tags: [Services]
 *     summary: Удалить услугу по ID (только admin). Каскадно удаляет связанные заказы и отзывы.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Услуга удалена
 *       403:
 *         description: Доступ запрещён
 *       404:
 *         description: Услуга не найдена
 */

// ── Orders ────────────────────────────────────

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Заказы текущего пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив заказов пользователя
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Не авторизован
 *   post:
 *     tags: [Orders]
 *     summary: Создать новый заказ
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [service_id, area, address, order_date]
 *             properties:
 *               service_id:
 *                 type: integer
 *                 example: 1
 *               area:
 *                 type: number
 *                 description: Площадь в м²
 *                 example: 45
 *               address:
 *                 type: string
 *                 example: ул. Ленина, д. 5, кв. 12
 *               order_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Заказ создан. total_price = base_price × area
 *       400:
 *         description: Ошибка валидации
 *       401:
 *         description: Не авторизован
 */

/**
 * @swagger
 * /api/orders/all:
 *   get:
 *     tags: [Orders]
 *     summary: Все заказы системы (только admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив всех заказов
 *       403:
 *         description: Доступ запрещён
 */

/**
 * @swagger
 * /api/cleaner/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Заказы, назначенные текущему клинеру
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив заказов клинера
 *       403:
 *         description: Доступ запрещён (только для role=cleaner)
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Получить заказ по ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Детали заказа
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Заказ не найден
 *   put:
 *     tags: [Orders]
 *     summary: Обновить заказ (площадь, адрес, статус)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               area:
 *                 type: number
 *               address:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, assigned, in_progress, completed]
 *                 description: Статус completed доступен только клинеру
 *     responses:
 *       200:
 *         description: Заказ обновлён
 *       400:
 *         description: Ошибка валидации или бизнес-логики
 *       403:
 *         description: Недостаточно прав
 *       404:
 *         description: Заказ не найден
 *   delete:
 *     tags: [Orders]
 *     summary: Отменить заказ. Если заказ оплачен — возвращает средства (удаляет платёж). Нельзя отменить выполненный заказ.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Заказ отменён (и возврат средств, если был оплачен)
 *       400:
 *         description: Нельзя отменить выполненный заказ
 *       404:
 *         description: Заказ не найден
 */

/**
 * @swagger
 * /api/orders/{id}/assign-cleaner:
 *   put:
 *     tags: [Orders]
 *     summary: Назначить клинера на заказ (только admin). Статус заказа меняется на assigned.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cleaner_id]
 *             properties:
 *               cleaner_id:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Клинер назначен, статус заказа = assigned
 *       400:
 *         description: Клинер не найден или неверная роль
 *       403:
 *         description: Доступ запрещён
 *       404:
 *         description: Заказ не найден
 */

// ── Payments ──────────────────────────────────

/**
 * @swagger
 * /api/payments:
 *   get:
 *     tags: [Payments]
 *     summary: История платежей текущего пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив платежей (по убыванию даты)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Не авторизован
 *   post:
 *     tags: [Payments]
 *     summary: Оплатить заказ
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [order_id]
 *             properties:
 *               order_id:
 *                 type: integer
 *                 example: 7
 *               payment_method:
 *                 type: string
 *                 enum: [card, bank_transfer]
 *                 default: card
 *     responses:
 *       201:
 *         description: Платёж создан. transaction_id генерируется автоматически (UUID).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Заказ уже оплачен, не найден или нет доступа
 *       401:
 *         description: Не авторизован
 */

/**
 * @swagger
 * /api/admin/payments:
 *   get:
 *     tags: [Payments]
 *     summary: Все платежи системы (только admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив всех платежей
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *       403:
 *         description: Доступ запрещён
 */

/**
 * @swagger
 * /api/orders/{orderId}/payment:
 *   get:
 *     tags: [Payments]
 *     summary: Получить платёж по ID заказа
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID заказа
 *     responses:
 *       200:
 *         description: Платёж или null, если заказ не оплачен
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/Payment'
 *                 - type: object
 *                   nullable: true
 *       401:
 *         description: Не авторизован
 */

// ── Reviews ───────────────────────────────────

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Отзывы текущего пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив отзывов
 *   post:
 *     tags: [Reviews]
 *     summary: Оставить отзыв на услугу
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [service_id, rating]
 *             properties:
 *               service_id:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Отзыв создан
 *       400:
 *         description: Ошибка валидации
 */

/**
 * @swagger
 * /api/reviews/all:
 *   get:
 *     tags: [Reviews]
 *     summary: Все отзывы системы (только admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив всех отзывов
 *       403:
 *         description: Доступ запрещён
 */

/**
 * @swagger
 * /api/reviews/{serviceId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Отзывы на конкретную услугу (публичный)
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Массив отзывов на услугу
 */

/**
 * @swagger
 * /api/review/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Получить отзыв по ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Детали отзыва
 *       404:
 *         description: Отзыв не найден
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Обновить отзыв по ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Отзыв обновлён
 *       404:
 *         description: Отзыв не найден
 *   delete:
 *     tags: [Reviews]
 *     summary: Удалить отзыв по ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Отзыв удалён
 *       404:
 *         description: Отзыв не найден
 */

// ── Order Ratings ─────────────────────────────

/**
 * @swagger
 * /api/orders/{orderId}/ratings:
 *   get:
 *     tags: [Order Ratings]
 *     summary: Оценки конкретного заказа (публичный)
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Массив оценок заказа
 *   post:
 *     tags: [Order Ratings]
 *     summary: Оценить выполненный заказ (rating 1–5)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Отличная работа!
 *     responses:
 *       201:
 *         description: Оценка создана
 *       400:
 *         description: Ошибка валидации
 */

/**
 * @swagger
 * /api/userRatings:
 *   get:
 *     tags: [Order Ratings]
 *     summary: Оценки, оставленные текущим пользователем
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Массив оценок пользователя
 */

/**
 * @swagger
 * /api/ratings:
 *   get:
 *     tags: [Order Ratings]
 *     summary: Все оценки заказов (публичный)
 *     responses:
 *       200:
 *         description: Массив всех оценок
 */

/**
 * @swagger
 * /api/ratings/{id}:
 *   get:
 *     tags: [Order Ratings]
 *     summary: Получить оценку по ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Детали оценки
 *       404:
 *         description: Оценка не найдена
 *   put:
 *     tags: [Order Ratings]
 *     summary: Обновить оценку по ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Оценка обновлена
 *       404:
 *         description: Оценка не найдена
 *   delete:
 *     tags: [Order Ratings]
 *     summary: Удалить оценку по ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Оценка удалена
 *       404:
 *         description: Оценка не найдена
 */

// ── Shared schemas ────────────────────────────

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         service_id:
 *           type: integer
 *         cleaner_id:
 *           type: integer
 *           nullable: true
 *         area:
 *           type: number
 *           description: Площадь в м²
 *         total_price:
 *           type: number
 *           description: base_price × area
 *         address:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, assigned, in_progress, completed]
 *         order_date:
 *           type: string
 *           format: date-time
 *         completion_date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         service:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             name:
 *               type: string
 *             base_price:
 *               type: number
 *         cleaner:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *             username:
 *               type: string
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         order_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         amount:
 *           type: number
 *         status:
 *           type: string
 *           example: paid
 *         payment_method:
 *           type: string
 *           enum: [card, bank_transfer]
 *         transaction_id:
 *           type: string
 *           description: UUID транзакции
 *         created_at:
 *           type: string
 *           format: date-time
 */
