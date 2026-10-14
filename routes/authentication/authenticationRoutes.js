const express = require('express');
const routes = express.Router();

const {
    registerController,
    loginController
} = require('../../controllers/authentication/authenticationController') 

// registration route
routes.post('/registration',registerController);

// login route
routes.post('/login',loginController);

module.exports = routes;