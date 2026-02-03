import {logger} from '../utils/logger.js';

const start = {
  /**
   * Renders the start (home) page.
   * @param {!Object} request The HTTP request object.
   * @param {!Object} response The HTTP response object.
   */
  createView(request, response) {
    logger.info('Start page loading!');
    response.send('Welcome to the Playlist app!');
  },
};

export {start};