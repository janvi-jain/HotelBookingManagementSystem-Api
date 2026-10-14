const express = require('express');
const routes = express.Router();

const authenticationRoutes = require('./authentication/authenticationRoutes')
const roomTypesRoutes = require('./roomTypes/roomTypesRoutes')
const userRoutes = require('./users/userRoutes')
const hotelRoutes = require('./hotels/hotelRoutes')
const bookingRoutes = require('./bookings/bookingRoutes')
const roomRoutes = require('./rooms/roomsRoutes')
const paymentRoutes = require('./payments/paymentsRoutes')

//authenticaton
// @/api/auth/
routes.use('/auth',authenticationRoutes)

//roomTypes
// @/api/roomTypes/
routes.use('/roomTypes',roomTypesRoutes)

//user
// @/api/user
routes.use('/user',userRoutes)

//user
// @/api/hotel
routes.use('/hotel',hotelRoutes)

//booking
// @/api/booking
routes.use('/booking',bookingRoutes)

//room
// @/api/room
routes.use('/room', roomRoutes)

//payment
// @/api/payment
routes.use('/payment', paymentRoutes)

module.exports = routes;