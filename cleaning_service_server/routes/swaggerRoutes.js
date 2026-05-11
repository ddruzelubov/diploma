/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's name
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email already registered
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     tags: [Users]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: User logged in successfully
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
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Текущий пользователь (личный кабинет)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Профиль без пароля
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
 */

/**
 * @swagger
 * /api/users/me:
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
 *         description: Ошибка валидации или бизнес-логики
 *       401:
 *         description: Не авторизован
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management
 */

/**
 * @swagger
 * /api/services:
 *   post:
 *     tags: [Services]
 *     summary: Create a new service
 *     security:
 *       - bearerAuth: []
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
 *       201:
 *         description: Service created successfully
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/services:
 *   get:
 *     tags: [Services]
 *     summary: Get all services
 *     responses:
 *       200:
 *         description: List of services
 */

/**
 * @swagger
 * /api/services/{id}:
 *   put:
 *     tags: [Services]
 *     summary: Update a service by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the service to update
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
 *         description: Service updated successfully
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     tags: [Services]
 *     summary: Delete a service by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the service to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Service deleted successfully
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_id:
 *                 type: integer
 *               area:
 *                 type: number
 *               address:
 *                 type: string
 *               order_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all user orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 */

/**
 * @swagger
 * /api/orders/all:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get an order by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     tags: [Orders]
 *     summary: Update an order by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to update
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
 *               completion_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete an order by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a new review
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_id:
 *                 type: integer
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all user reviews
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user reviews
 */

/**
 * @swagger
 * /api/reviews/all:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reviews
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/reviews/{serviceId}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get reviews by service ID
 *     parameters:
 *       - in: path
 *         name: serviceId
 *         required: true
 *         description: ID of the service to get reviews for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of reviews for the service
 */

/**
 * @swagger
 * /api/review/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get a review by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Review details
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update a review by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to update
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
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       404:
 *         description: Review not found
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the review to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * tags:
 *   name: Order Ratings
 *   description: Order rating management
 */

/**
 * @swagger
 * /api/orders/{orderId}/ratings:
 *   post:
 *     tags: [Order Ratings]
 *     summary: Create a rating for an order
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID of the order to rate
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
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rating created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/orders/{orderId}/ratings:
 *   get:
 *     tags: [Order Ratings]
 *     summary: Get all ratings for an order
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         description: ID of the order to get ratings for
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of ratings for the order
 */

/**
 * @swagger
 * /api/userRatings:
 *   get:
 *     tags: [Order Ratings]
 *     summary: Get all ratings by user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of ratings by the user
 */

/**
 * @swagger
 * /api/ratings:
 *   get:
 *     tags: [Order Ratings]
 *     summary: Get all order ratings
 *     responses:
 *       200:
 *         description: List of all order ratings
 */

/**
 * @swagger
 * /api/ratings/{id}:
 *   get:
 *     tags: [Order Ratings]
 *     summary: Get an order rating by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the rating to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rating details
 *       404:
 *         description: Rating not found
 */

/**
 * @swagger
 * /api/ratings/{id}:
 *   put:
 *     tags: [Order Ratings]
 *     summary: Update an order rating by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the rating to update
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
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       404:
 *         description: Rating not found
 *       403:
 *         description: Access denied
 */

/**
 * @swagger
 * /api/ratings/{id}:
 *   delete:
 *     tags: [Order Ratings]
 *     summary: Delete an order rating by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the rating to delete
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Rating deleted successfully
 *       404:
 *         description: Rating not found
 *       403:
 *         description: Access denied
 */