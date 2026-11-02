const express = require('express');
const routes = express.Router();

const {
    bookingcreateContoller,
    bookingfetchAllAdminController,
    bookingfetchAllManagerController,
    bookingfetchAllGuestController,
    bookingsinglefetchController,
    bookingupdateAdminController,
    bookingupdateManagerController,
    bookingdeleteController
} = require('../../controllers/bookings/bookingController'); 

const {
    authenticate,
    authorization
} = require('../../middleware/auth/authMiddleware');

// create route
routes.post('/',authenticate,authorization(['guest']),bookingcreateContoller);

// fetch all route
// routes.get('/',authenticate,authorization(['admin', 'manager', 'guest']),bookingfetchAllController);

// Fetch All Bookings - Admin
routes.get('/admin/get-all',authenticate,authorization(['admin']),bookingfetchAllAdminController);

// Fetch All Bookings - Manager
routes.get('/manager/get-all',authenticate,authorization(['manager']),bookingfetchAllManagerController);

// Fetch All Bookings - Guest
routes.get('/guest/get-all',authenticate,authorization(['guest']),bookingfetchAllGuestController);

// fetch single route
routes.get('/:id',authenticate,bookingsinglefetchController);

// update route
// routes.put('/:id',authenticate,authorization(['admin', 'manager']),bookingupdateController);

// Update Booking - Admin
routes.put('/admin/:id',authenticate,authorization(['admin']),bookingupdateAdminController);

// Update Booking - Manager
routes.put('/manager/:id',authenticate,authorization(['manager']),bookingupdateManagerController);

// delete route - Admin
routes.delete('/:id',authenticate,authorization(['admin']),bookingdeleteController);

module.exports = routes;