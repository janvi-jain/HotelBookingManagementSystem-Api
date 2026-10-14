const express = require('express');
const routes = express.Router();

const upload = require('../../middleware/uploadMiddleware/uploadMiddleware');
const {
    roomscreateContoller,
    roomfetchAllAdminController,
    roomfetchAllManagerController,
    roomfetchAllGuestController,
    roomssinglefetchController,
    roomsupdateManagerController,
    roomsupdateAdminController,
    roomsdeleteManagerController,
    roomsdeleteAdminController,
    roomsApproveController,
    roomsRejectController
} = require('../../controllers/rooms/roomController'); 

const {
    authenticate,
    authorization
} = require('../../middleware/auth/authMiddleware');

// create route
routes.post('/',authenticate,authorization(['manager']),upload.single('image'),roomscreateContoller);

// Admin approve room
routes.patch('/:id/approve',authenticate,authorization(['admin']),roomsApproveController);

// Admin reject room
routes.patch('/:id/reject',authenticate,authorization(['admin']),roomsRejectController);

// fetch all route
// routes.get('/',authenticate,roomsfetchAllController);

// Fetch All Hotels - Admin
routes.get('/admin/get-all',authenticate,authorization(['admin']),roomfetchAllAdminController);

// Fetch All Hotels - Manager
routes.get('/manager/get-all',authenticate,authorization(['manager']),roomfetchAllManagerController);

// Fetch All Hotels - Guest
routes.get('/guest/get-all',authenticate,authorization(['guest']),roomfetchAllGuestController);

// Update Room - Admin
routes.put('/admin/:id',authenticate,authorization(['admin']),roomsupdateAdminController);

// Update Room - Manager
routes.put('/manager/:id',authenticate,authorization(['manager']),roomsupdateManagerController);

// fetch single room
routes.get('/:id',authenticate,roomssinglefetchController);

// Delete Room - Admin
routes.delete('/admin/:id',authenticate,authorization(['admin']),roomsdeleteAdminController);

// delete route - manager
routes.delete('/manager/:id',authenticate,authorization(['manager']),roomsdeleteManagerController);


module.exports = routes;