import {logger} from '../utils/logger.js';

const playlist = Object.freeze([
  Object.freeze({id: 1, title: 'Piano Sonata No. 3', artist: 'Beethoven'}),
  Object.freeze({id: 2, title: 'Piano Sonata No. 7', artist: 'Beethoven'}),
  Object.freeze({id: 3, title: 'Piano Sonata No. 10', artist: 'Beethoven'}),
]);

const dashboard = {
  createView(req, res) {
    logger.info('Dashboard page loading!');
    logger.debug('Loading the playlist', {count: playlist.length});
    res.json(playlist);
  },
};

export {dashboard};