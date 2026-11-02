const express = require('express');
const routes = express.Router();

const {
    roomTypecreateContoller,
    roomTypefetchAllController,
    roomTypesinglefetchController,
    roomTypeupdateController,
    roomTypedeleteController
} = require('../../controllers/roomTypes/roomTypesController'); 

const {
    authenticate,
    authorization
} = require('../../middleware/auth/authMiddleware');

// create route
routes.post('/',authenticate,authorization(['admin']),roomTypecreateContoller);

// fetch all route
routes.get('/',authenticate,authorization(['admin']),roomTypefetchAllController);

// fetch single route
routes.get('/:id',authenticate,authorization(['admin']),roomTypesinglefetchController);

// update route
routes.put('/:id',authenticate,authorization(['admin']),roomTypeupdateController);

// delete route
routes.delete('/:id',authenticate,authorization(['admin']),roomTypedeleteController);

module.exports = routes;