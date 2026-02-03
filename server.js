import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import {logger} from './utils/logger.js';
import {router} from './routes.js';
import {requestLogger} from './middleware/request-logger.js';
import {notFoundHandler} from './middleware/not-found.js';
import {errorHandler} from './middleware/error-handler.js';

const app = express();
const port = process.env.PORT || 3000;

app.set('trust proxy', 1);

app.use(helmet());
app.disable('x-powered-by');

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET'],
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {status: 'error', message: 'Too many requests, try again later'},
}));

app.use(requestLogger);
app.use(express.json({limit: '10kb'}));
app.use('/', router);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  logger.info(`App listening on port ${port} [${process.env.NODE_ENV || 'development'}]`);
});