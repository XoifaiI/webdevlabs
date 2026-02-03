import {logger} from '../utils/logger.js';

const about = {
  aboutView(req, res) {
    logger.info('About page loading!');
    res.send('About the Playlist app');
  },
};

export {about};