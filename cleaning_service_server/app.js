require('dotenv').config();
const passport = require('./middleware/passport');
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const sequelize = require('./config/database'); 
const connectDB = require('./config/mongo');
const { swaggerUi, swaggerDocs } = require('./documentation/swagger');
const httpLogger = require('./middleware/httpLogger');

const app = express();

connectDB();

app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));

app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(httpLogger);
app.use('/api', routes);
app.use(errorHandler); 

const PORT = process.env.PORT || 3001;
sequelize.sync().then(() => {
    app.listen(PORT, 'localhost', () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
