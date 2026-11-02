const express = require('express');
const routes = express.Router();

const upload = require('../../middleware/uploadMiddleware/uploadMiddleware');
const {
    hotelcreateContoller,
    hotelfetchAllAdminController,
    hotelfetchAllManagerController,
    hotelfetchAllGuestController,
    hotelsinglefetchController,
    hotelupdateAdminController,
    hotelupdateManagerController,
    hoteldeleteManagerController,
    hoteldeleteAdminController,
    hotelApproveController,
    hotelRejectController,
    hotelSearchFilterController
} = require('../../controllers/hotels/hotelController');

const {
    authenticate,
    authorization
} = require('../../middleware/auth/authMiddleware');

// Create Hotel
routes.post('/',authenticate,authorization(['manager']),upload.single('image'),hotelcreateContoller);

// Admin approve hotel
routes.patch('/:id/approve',authenticate,authorization(['admin']),hotelApproveController);

// Admin reject hotel
routes.patch('/:id/reject',authenticate,authorization(['admin']),hotelRejectController);

// Fetch All Hotels
// routes.get('/',authenticate,hotelfetchAllController);

// Fetch All Hotels - Admin
routes.get('/admin/get-all',authenticate,authorization(['admin']),hotelfetchAllAdminController);

// Fetch All Hotels - Manager
routes.get('/manager/get-all',authenticate,authorization(['manager']),hotelfetchAllManagerController);

// Fetch All Hotels - Guest
routes.get('/guest/get-all',authenticate,authorization(['guest']),hotelfetchAllGuestController);

// Search & Filter Hotels - Guest
routes.get('/guest/search',authenticate,authorization(['guest']),hotelSearchFilterController);

// Fetch Single Hotel
routes.get('/:id',authenticate,hotelsinglefetchController);

// Update Hotel
// routes.put('/:id',authenticate,authorization(['manager']),hotelupdateController);

// Update Hotel - admin
routes.put('/admin/:id',authenticate,authorization(['admin']),hotelupdateAdminController);

// Update Hotel - manager
routes.put('/manager/:id',authenticate,authorization(['manager']),hotelupdateManagerController);

// Delete Hotel - admin
routes.delete('/admin/:id', authenticate, authorization(['admin']), hoteldeleteAdminController);

// Delete Hotel - manager
routes.delete('/manager/:id',authenticate,authorization(['manager']),hoteldeleteManagerController);


module.exports = routes;
