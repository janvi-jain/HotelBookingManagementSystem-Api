const express = require('express');
const routes = express.Router();

const {
    paymentcreateContoller,
    paymentfetchAllAdminController,
    paymentfetchAllGuestController,
    paymentfetchAllManagerController,
    paymentsinglefetchController,
    paymentupdateAdminController,
    paymentupdateManagerController,
    paymentdeleteAdminController,
    paymentdeleteManagerController
} = require('../../controllers/payments/paymentsController'); 

const {
    authenticate,
    authorization
} = require('../../middleware/auth/authMiddleware');

// create route
routes.post('/',authenticate,authorization(['guest']),paymentcreateContoller);

// fetch all route
// routes.get('/',authenticate,authorization(['admin','manager','guest']),,paymentfetchAllController);

// Fetch All Payments - Admin
routes.get('/admin/get-all',authenticate,authorization(['admin']),paymentfetchAllAdminController);

// Fetch All Payments - Manager
routes.get('/manager/get-all',authenticate,authorization(['manager']),paymentfetchAllManagerController);

// Fetch All Payments - Guest
routes.get('/guest/get-all',authenticate,authorization(['guest']),paymentfetchAllGuestController);

// fetch single route
routes.get('/:id',authenticate,authorization(['admin', 'manager', 'guest']),paymentsinglefetchController);

// update route
// routes.put('/:id',paymentupdateController);

// update  route - Admin
routes.put('/admin/:id',authenticate,authorization(['admin']),paymentupdateAdminController);

// update  route - Manager
routes.put('/manager/:id',authenticate,authorization(['manager']),paymentupdateManagerController);

// delete route
// routes.delete('/:id',paymentdeleteController);

// delete route - Admin
routes.delete('/admin/:id',authenticate,authorization(['admin']),paymentdeleteAdminController);

// delete route - Manager
routes.delete('/manager/:id',authenticate,authorization(['manager']),paymentdeleteManagerController);

module.exports = routes;