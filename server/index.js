/* eslint camelcase: 0 */
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';

import refreshToken from './middlewares/refreshToken';
import auth from './controllers/auth';
import base from './controllers/base';
import create from './controllers/create';
import loggedIn from './middlewares/loggedIn';
import initDb from './db';
import initCron from './cron';

const APP_PORT = 3000;

// Connect to db
initDb();

// Setup cron jobs
initCron();

// Setup app and routes
const app = express();

app.use(cookieParser());

app.get('/', base);
app.get('/auth/*', auth);
app.get(['/create/*', '/follow/*'], loggedIn, base);
app.post('/create/:playlist', refreshToken, create);
app.use(express.static(path.join(__dirname, '../client/build')));

app.listen(APP_PORT);
