const AuthRouter = require('express').Router();
const AuthController = require('../controller/AuthController');

AuthRouter.post('/signup',AuthController.signUp);
AuthRouter.post('/login',AuthController.logIn);
AuthRouter.post('/logout',AuthController.logOut);

module.exports = AuthRouter;