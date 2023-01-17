const UserRouter = require('express').Router();
const UserController = require('../controller/UserController');


UserRouter.get('/:user', UserController.getUser);
UserRouter.get('/:user/songs', UserController.getLikedSongs);
UserRouter.get('/:user/artists',UserController.getFollowingArtists);
UserRouter.put('/:user/songs/:song',UserController.likeSong);
UserRouter.put('/:user/artists/:artist',UserController.followArtist);
UserRouter.put('/user/info',UserController.editProfile);


module.exports = UserRouter;