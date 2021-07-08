import express from 'express';
import notFoundMiddleware from './middleware/not-found.js';
import errorMiddleware from './middleware/error.js';
import authController from './controllers/auth.js';
import photoController from './controllers/photos.js';
<<<<<<< HEAD
=======
import spotsController from './controllers/spots.js';

>>>>>>> 6658eaa484d4319c211a81049c5ef44a21fd2982

const app = express();

app.use(express.json());

app.use('/api/v1', authController);
app.use('/api/v1/photos', photoController);
<<<<<<< HEAD
=======
app.use('/api/v1/spots', spotsController);

>>>>>>> 6658eaa484d4319c211a81049c5ef44a21fd2982

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
