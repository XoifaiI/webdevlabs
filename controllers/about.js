import {logger} from '../utils/logger.js';

const about = {
  /**
   * Renders the about page.
   * @param {!Object} request The HTTP request object.
   * @param {!Object} response The HTTP response object.
   */
  aboutView(request, response) {
    logger.info('About page loading!');
    response.send('About the Playlist app');
  },
};

export {about};