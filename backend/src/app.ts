import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import './database';
import apiErrorHandler from './middlewares/apiErrorHandler';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(apiErrorHandler);

export default app;
