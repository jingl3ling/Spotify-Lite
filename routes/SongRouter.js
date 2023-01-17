const SongRouter = require('express').Router();
const SongController = require('../controller/SongController');

SongRouter.get('/',SongController.browseSongs);
SongRouter.get('/:search',SongController.searchSong);

module.exports = SongRouter;