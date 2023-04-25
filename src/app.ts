import express, {json, NextFunction, Request, Response} from 'express';
import mongoose from 'mongoose';
import router from './routes';
import { RequestCustom } from './types';

const { PORT = 3000 } = process.env;

const app = express();

app.use(json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  const reqCustom = req as RequestCustom;
  reqCustom.user = {
    _id: '64442b09d347053db3e59b35',
  };

  next();
});

app.use(router);

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
