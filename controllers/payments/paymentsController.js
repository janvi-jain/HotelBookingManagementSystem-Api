const paymentModel = require('../../models/payments/paymentModel')
const bookingModel = require('../../models/bookings/bookingsModel')
const hotelModel = require('../../models/hotels/hotelsModel')

const paymentcreateContoller = async (req, res) => {
    try {
        const { bookingId, paymentStatus, transactionDetails } = req.body;

        const booking = await bookingModel.findById(bookingId);
        if (!booking) {
            return res.status(404).json({status: false,message: "Booking ID does not exist in the backend.",data: null});
        }

        if (booking.guestId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({status: false,message: "You can only make payment for your own booking.",data: null});
        }

        if (!['pending', 'paid', 'failed'].includes(paymentStatus)) {
            return res.status(400).json({status: false,message: "Invalid payment status.",data: null});
        }

        const amount = booking.amount;
        const payment = new paymentModel({bookingId,amount,paymentStatus,transactionDetails});

        if (paymentStatus === 'paid') {
            booking.paymentStatus = 'paid';
            booking.status = 'confirmed';
        }

        if (paymentStatus === 'failed') {
            booking.paymentStatus = 'failed';
            booking.status = 'pending';
        }

        if (paymentStatus === 'pending') {
            booking.paymentStatus = 'pending';
            booking.status = 'pending';
        }

        await booking.save();
        await payment.save();

        return res.status(200).json({status: true,message: "Payment created successfully.",data: payment});
    } catch (error) {
        console.log("error in payment create controller ->", error);
        return res.status(500).json({status: false,message: "Server side error in payment create controller",data: error});
    }
};

const paymentfetchAllAdminController = async (req, res) => {
    try {
        const payment = await paymentModel.find();
        return res.status(200).json({ status: true, message: "All payments fetched successfully", data: payment });
    } catch (error) {
        console.log("error in admin fetch all payment controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in admin fetch all payment controller", data: error });
    }
};

const paymentfetchAllGuestController = async (req, res) => {
    try {
        const bookings = await bookingModel.find({ guestId: req.user.userId });
        const bookingIds = bookings.map(booking => booking._id);
        const payment = await paymentModel.find({ bookingId: { $in: bookingIds } });

        return res.status(200).json({ status: true, message: "Your payments fetched successfully", data: payment });
    } catch (error) {
        console.log("error in guest fetch all payment controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in guest fetch all payment controller", data: error });
    }
};

const paymentfetchAllManagerController = async (req, res) => {
    try {
        const hotels = await hotelModel.find({ managerId: req.user.userId });
        const hotelIds = hotels.map(hotel => hotel._id);

        const bookings = await bookingModel.find({ hotelId: { $in: hotelIds } });
        const bookingIds = bookings.map(booking => booking._id);

        const payment = await paymentModel.find({ bookingId: { $in: bookingIds } });

        return res.status(200).json({ status: true, message: "Your hotel payments fetched successfully", data: payment });
    } catch (error) {
        console.log("error in manager fetch all payment controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in manager fetch all payment controller", data: error });
    }
};

const paymentsinglefetchController = async (req, res) => {
    try {
        let { id } = req.params;
        const payment = await paymentModel.findById(id);
        if (!payment) {
            return res.status(401).json({ status: false, message: "Payment ID does not exist in the backend.", data: null });
        }

        if (req.user.role === 'admin') {
            return res.status(200).json({ status: true, message: "Single payment fetched successfully", data: payment });
        }

        const booking = await bookingModel.findById(payment.bookingId);
        if (!booking) {
            return res.status(401).json({ status: false, message: "Booking does not exist.", data: null });
        }

        if (req.user.role === 'guest') {
            if (booking.guestId.toString() !== req.user.userId.toString()) {
                return res.status(401).json({ status: false, message: "You can only view your own payment.", data: null });
            }
            return res.status(200).json({ status: true, message: "Single payment fetched successfully", data: payment, data: null });
        }

        if (req.user.role === 'manager') {
            const hotel = await hotelModel.findById(booking.hotelId);
            if (!hotel) {
                return res.status(404).json({ status: false, message: "Hotel does not exist.", data: null });
            }
            if (hotel.managerId.toString() !== req.user.userId.toString()) {
                return res.status(400).json({ status: false, message: "You can only view payments of your own hotel.", data: null });
            }

            return res.status(200).json({status: true,message: "Single payment fetched successfully",data: payment});
        }
    } catch (error) {
        console.log("error in payment single fetch controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in payment single fetch controller", data: error });
    }
};

const paymentupdateAdminController = async (req, res) => {
    try {
        let { id } = req.params;
        const { paymentStatus, transactionDetails } = req.body;
        if (!['pending', 'paid', 'failed'].includes(paymentStatus)) {
            return res.status(400).json({ status: false, message: "Invalid payment status.", data: null });
        }

        let payment = await paymentModel.findOne({ _id: id })
        if (!payment) {
            return res.status(404).json({ status: false, message: "Payment ID does not exist in the backend." });
        }
        
        const booking = await bookingModel.findById(payment.bookingId);
        if (!booking) {
            return res.status(404).json({status: false,message: "Booking does not exist in the backend.",data: null});
        }
        
        const updatedpayment = await paymentModel.findByIdAndUpdate(id, { paymentStatus, transactionDetails }, { new: true });
        
        if (paymentStatus === 'paid') {
            booking.paymentStatus = 'paid';
            booking.status = 'confirmed';
        }

        if (paymentStatus === 'failed') {
            booking.paymentStatus = 'failed';
            booking.status = 'pending';
        }

        if (paymentStatus === 'pending') {
            booking.paymentStatus = 'pending';
            booking.status = 'pending';
        }

        await booking.save();

        return res.status(200).json({ status: true, message: "payment updated SucessFully ", data: updatedpayment })
    } catch (error) {
        console.log("error in payment update contoller ->", error)
        return res.status(500).json({ status: false, message: "server side error in payment update contoller", data: error })
    }
}

const paymentupdateManagerController = async (req, res) => {
    try {
        let { id } = req.params;
        const { paymentStatus, transactionDetails } = req.body;

        if (!['pending', 'paid', 'failed'].includes(paymentStatus)) {
            return res.status(400).json({status: false,message: "Invalid payment status.",data: null});
        }

        const payment = await paymentModel.findById(id);
        if (!payment) {
            return res.status(404).json({status: false,message: "Payment ID does not exist in the backend.",data: null});
        }

        const booking = await bookingModel.findById(payment.bookingId);
        if (!booking) {
            return res.status(404).json({status: false,message: "Booking does not exist.",data: null});
        }

        const hotel = await hotelModel.findById(booking.hotelId);
        if (!hotel) {
            return res.status(404).json({status: false,message: "Hotel does not exist.",data: null});
        }

        if (hotel.managerId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({status: false,message: "You can only update payments of your own hotel.",data: null});
        }

        const updatedPayment = await paymentModel.findByIdAndUpdate(id,{paymentStatus,transactionDetails},{new: true});

        if (paymentStatus === 'paid') {
            booking.paymentStatus = 'paid';
            booking.status = 'confirmed';
        }

        if (paymentStatus === 'failed') {
            booking.paymentStatus = 'failed';
            booking.status = 'pending';
        }

        if (paymentStatus === 'pending') {
            booking.paymentStatus = 'pending';
            booking.status = 'pending';
        }

        await booking.save();
        return res.status(200).json({status: true,message: "Payment updated successfully.",data: updatedPayment});
    } catch (error) {
        console.log("error in manager payment update controller ->", error);
        return res.status(500).json({status: false,message: "Server side error in manager payment update controller",data: error});
    }
};

const paymentdeleteAdminController = async (req, res) => {
    try {
        let { id } = req.params;
        
        const payment = await paymentModel.findById(id);
        if (!payment) {
            return res.status(404).json({status: false,message: "Payment ID does not exist in the backend.",data: null});
        }
        await paymentModel.findByIdAndDelete(id);

        return res.status(200).json({status: true,message: "Payment deleted successfully.",data: payment});
    } catch (error) {
        console.log("error in payment delete admin controller ->", error);
        return res.status(500).json({status: false,message: "Server side error in payment delete admin controller",data: error});
    }
};

const paymentdeleteManagerController = async (req, res) => {
    try {
        let { id } = req.params;

        const payment = await paymentModel.findById(id);
        if (!payment) {
            return res.status(404).json({status: false,message: "Payment ID does not exist in the backend.",data: null});
        }

        const booking = await bookingModel.findById(payment.bookingId);
        if (!booking) {
            return res.status(404).json({status: false,message: "Booking does not exist in the backend.",data: null});
        }

        const hotel = await hotelModel.findById(booking.hotelId);
        if (!hotel) {
            return res.status(404).json({status: false,message: "Hotel does not exist in the backend.",data: null});
        }

        if (hotel.managerId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({status: false,message: "You can only delete payment of your own hotel.",data: null});
        }
        
        await paymentModel.findByIdAndDelete(id);
        return res.status(200).json({status: true,message: "Payment deleted successfully.",data: payment});
    } catch (error) {
        console.log("error in payment delete manager controller ->", error);
        return res.status(500).json({status: false,message: "Server side error in payment delete manager controller.",data: error});
    }
};

module.exports = {
    paymentcreateContoller,
    paymentfetchAllAdminController,
    paymentfetchAllGuestController,
    paymentfetchAllManagerController,
    paymentsinglefetchController,
    paymentupdateAdminController,
    paymentupdateManagerController,
    paymentdeleteAdminController,
    paymentdeleteManagerController
}