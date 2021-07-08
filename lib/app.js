import express from 'express';
import notFoundMiddleware from './middleware/not-found.js';
import errorMiddleware from './middleware/error.js';
import authController from './controllers/auth.js';
import photoController from './controllers/photos.js';

const app = express();

app.use(express.json());

app.use('/api/v1', authController);
app.use('/api/v1/photos', photoController);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
