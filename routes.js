import express from 'express';

import {about} from './controllers/about.js';
import {dashboard} from './controllers/dashboard.js';
import {start} from './controllers/start.js';

const router = express.Router();

router.get('/start', start.createView);
router.get('/dashboard', dashboard.createView);
router.get('/about', about.aboutView);

export {router};