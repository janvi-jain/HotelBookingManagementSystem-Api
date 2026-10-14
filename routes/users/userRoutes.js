const express = require('express');
const routes = express.Router();

const {
    userfetchAllAdminController,
    userfetchAllManagerController,
    userfetchAllGuestController,
    usersinglefetchController,
    userupdateAdminController,
    userdeleteAdminController
} = require('../../controllers/users/userController');

const {
    authenticate,
    authorization
} = require('../../middleware/auth/authMiddleware');

// Fetch All Users
// routes.get('/',authenticate,authorization(['admin', 'manager', 'guest']),userfetchAllController);

// Fetch All - Admin
routes.get('/admin/get-all',authenticate,authorization(['admin']),userfetchAllAdminController);

// Fetch All - Manager
routes.get('/manager/get-all',authenticate,authorization(['manager']),userfetchAllManagerController);

// Fetch All - Guest
routes.get('/guest/get-all',authenticate,authorization(['guest']),userfetchAllGuestController);

// Fetch Single User
routes.get('/:id',authenticate,usersinglefetchController);

// Update User - admin
routes.put('/admin/:id',authenticate,authorization(['admin']),userupdateAdminController);

// Delete User
routes.delete('/admin/:id',authenticate,authorization(['admin']),userdeleteAdminController);

module.exports = routes;