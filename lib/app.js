import express from 'express';
import notFoundMiddleware from './middleware/not-found.js';
import errorMiddleware from './middleware/error.js';
import authController from './controllers/auth.js';
import photoController from './controllers/photos.js';
import spotsController from './controllers/spots.js';
import findController from './controllers/finds.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/v1', authController);
app.use('/api/v1/photos', photoController);
app.use('/api/v1/spots', spotsController);
app.use('/api/v1/finds', findController);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
