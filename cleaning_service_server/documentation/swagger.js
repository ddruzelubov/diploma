const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Cleaning Service API',
            version: '1.0.0',
            description: 'REST API клинингового сервиса: пользователи, услуги, заказы, отзывы и оценки заказов',
        },
        servers: [
            {
                url: 'http://127.0.0.1:5000', 
            },
        ],
        components: { 
            securitySchemes: { 
              bearerAuth: { 
                type: "http", 
                scheme: "bearer", 
                bearerFormat: "JWT", 
              }, 
            }, 
        }, 
    },
    apis: ['./routes/swaggerRoutes.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
    swaggerUi,
    swaggerDocs,
};