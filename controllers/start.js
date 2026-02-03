import {logger} from '../utils/logger.js';

const start = {
  createView(req, res) {
    logger.info('Start page loading!');
    res.send('Welcome to the Playlist app!');
  },
};

export {start};