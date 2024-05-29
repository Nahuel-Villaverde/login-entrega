import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import __dirname from './utils.js';
import cartApiRouter from './routes/api/carts.router.js';
import productApiRouter from './routes/api/products.router.js';
import viewRouterProduct from './routes/views/products.view.router.js';
import viewRouterCart from './routes/views/carts.view.router.js';
import sessionsRouter from './routes/api/sessions.js';
import viewsRouter from './routes/views/views.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: MONGO_URL,
    }),
    // cookie: { maxAge: 180 * 60 * 1000 },
}));

app.engine('handlebars', handlebars.engine({
    extname: '.handlebars',
    defaultLayout: 'main',
    helpers: {
        eq: (v1, v2) => v1 === v2,
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

mongoose.connect(MONGO_URL)
.then(() => { console.log("Conectado a la base de datos") })
.catch(error => console.error("Error en la conexión", error));

app.use('/api/carts', cartApiRouter);
app.use('/api/products', productApiRouter);
app.use('/products', viewRouterProduct);
app.use('/carts', viewRouterCart);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});