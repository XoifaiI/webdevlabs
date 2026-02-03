import {logger} from '../utils/logger.js';

const requestLogger = (req, res, next) => {
  logger.info({method: req.method, url: req.originalUrl});
  next();
};

export {requestLogger};