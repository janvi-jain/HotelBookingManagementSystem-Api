const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    guestId: {
        type: mongoose.Schema.ObjectId,
        ref: "HotelUsers",
        required: true
    },

    hotelId: {
        type: mongoose.Schema.ObjectId,
        ref: "Hotels",
        required: true
    },

    roomId: {
        type: mongoose.Schema.ObjectId,
        ref: "HotelRooms",
        required: true
    },

    checkInDate: {
        type: Date,
        required: true
    },

    checkOutDate: {
        type: Date,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending',
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
        required: true
    }

}, { timestamps: true });

const bookingModel = mongoose.model('HotelBooking', bookingSchema);

module.exports = bookingModel;