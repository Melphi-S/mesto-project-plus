import express, { json } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import router from './routes';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './middlewares/errorHandler';
import { createUserValidation, loginValidation } from './validation';

require('dotenv').config();

const { PORT } = process.env;

const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);

app.use(auth);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
