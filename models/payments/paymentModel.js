const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    bookingId: {
        type: mongoose.Schema.ObjectId,
        ref: "HotelBooking",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        required: true
    },
    transactionDetails: {
        type: String,
        required: true
    }
}, { timestamps: true })

const paymentModel = mongoose.model('HotelPayments', paymentSchema)

module.exports = paymentModel;