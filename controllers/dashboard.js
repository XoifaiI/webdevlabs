import {logger} from '../utils/logger.js';

const playlist = [
  {
    id: 1,
    title: 'Piano Sonata No. 3',
    artist: 'Beethoven',
  },
  {
    id: 2,
    title: 'Piano Sonata No. 7',
    artist: 'Beethoven',
  },
  {
    id: 3,
    title: 'Piano Sonata No. 10',
    artist: 'Beethoven',
  },
];

const dashboard = {
  /**
   * Renders the dashboard page with the playlist data.
   * @param {!Object} request The HTTP request object.
   * @param {!Object} response The HTTP response object.
   */
  createView(request, response) {
    logger.info('Dashboard page loading!');
    logger.debug('Loading the playlist', playlist);
    response.json(playlist);
  },
};

export {dashboard};