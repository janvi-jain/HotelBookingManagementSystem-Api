const bookingModel = require('../../models/bookings/bookingsModel')
// const userModel = require('../../models/users/userModel')
const hotelModel = require('../../models/hotels/hotelsModel')
const roomModel = require('../../models/rooms/RoomsModel')

const bookingcreateContoller = async (req, res) => {
    try {
        const { hotelId, roomId, checkInDate, checkOutDate } = req.body;

        let hotel = await hotelModel.findOne({ _id: hotelId });
        if (!hotel) {
            return res.status(400).json({ status: false, message: "Hotel ID does not exist in the backend." });
        }

        if (hotel.status !== 'approved') {
            return res.status(400).json({ status: false, message: "You can only book an approved hotel.", data: null });
        }

        let room = await roomModel.findOne({ _id: roomId });
        if (!room) {
            return res.status(400).json({ status: false, message: "Room ID does not exist in the backend." });
        }

        if (room.status !== 'approved') {
            return res.status(400).json({ status: false, message: "You can only book an approved room.", data: null });
        }

        if (room.hotelId.toString() !== hotelId) {
            return res.status(400).json({ status: false, message: "Room does not belong to this hotel." });
        }

        if (new Date(checkInDate) < new Date()) {
            return res.status(400).json({ status: false, message: "Check-in date cannot be in the past.", data: null });
        }

        if (new Date(checkInDate) >= new Date(checkOutDate)) {
            return res.status(400).json({ status: false, message: "Check-out date must be after check-in date." });
        }

        const bookingExist = await bookingModel.findOne({
            roomId: roomId,
            checkInDate: { $lt: new Date(checkOutDate) },
            checkOutDate: { $gt: new Date(checkInDate) },
            status: { $in: ['pending', 'confirmed'] }
        });

        if (bookingExist) {
            return res.status(400).json({ status: false, message: "Room is already booked for these dates." });
        }

        const days = Math.ceil(
            (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
        );

        const amount = days * room.pricePerNight;

        const booking = new bookingModel({ guestId: req.user.userId, hotelId, roomId, checkInDate, checkOutDate, amount, status: "pending", paymentStatus: "pending" });
        await booking.save();

        return res.status(200).json({ status: true, message: "booking Created SucessFully", data: booking })
    } catch (error) {
        console.log("error in booking create contoller ->", error)
        return res.status(500).json({ status: false, message: "server side error in booking create contoller", data: error })
    }
}

const bookingfetchAllAdminController = async (req, res) => {
    try {
        const booking = await bookingModel.find();
        return res.status(200).json({ status: true, message: "All Booking Fetched Successfully", data: booking });
    } catch (error) {
        console.log("error in admin fetch all booking controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in admin fetch all booking controller", data: error });
    }
};

const bookingfetchAllManagerController = async (req, res) => {
    try {
        const hotels = await hotelModel.find({ managerId: req.user.userId });

        const hotelIds = hotels.map(hotel => hotel._id);
        const booking = await bookingModel.find({ hotelId: { $in: hotelIds } });

        return res.status(200).json({ status: true, message: "Your hotel bookings fetched successfully", data: booking });
    } catch (error) {
        console.log("error in manager fetch all booking controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in manager fetch all booking controller", data: error });
    }
};

const bookingfetchAllGuestController = async (req, res) => {
    try {
        const booking = await bookingModel.find({ guestId: req.user.userId });
        return res.status(200).json({ status: true, message: "Your bookings fetched successfully", data: booking });
    } catch (error) {
        console.log("error in guest fetch all booking controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in guest fetch all booking controller", data: error });
    }
};

const bookingsinglefetchController = async (req, res) => {
    try {
        let { id } = req.params;

        const booking = await bookingModel.findById(id);
        if (!booking) {
            return res.status(404).json({status: false,message: "Booking ID does not exist in the backend.",data: null});
        }

        if (req.user.role === 'guest') {
            if (booking.guestId.toString() !== req.user.userId.toString()) {
                return res.status(403).json({status: false,message: "You can only view your own booking.",data: null});
            }
        }

        if (req.user.role === 'manager') {
            const hotel = await hotelModel.findById(booking.hotelId);
            if (!hotel) {
                return res.status(404).json({status: false,message: "Hotel does not exist.",data: null});
            }

            if (hotel.managerId.toString() !== req.user.userId.toString()) {
                return res.status(403).json({status: false,message: "You can only view bookings of your own hotel.",data: null});
            }
        }

        return res.status(200).json({status: true,message: "Single booking fetched successfully.",data: booking});
    } catch (error) {
        console.log("error in booking single fetch controller ->", error);
        return res.status(500).json({status: false,message: "Server side error in booking single fetch controller",data: error});
    }
};

const bookingupdateAdminController = async (req, res) => {
    try {
        let { id } = req.params;
        const { status } = req.body;
        const booking = await bookingModel.findById(id);

        if (!booking) {
            return res.status(400).json({ status: false, message: "Booking ID does not exist in the backend." });
        }

        // Check valid status
        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ status: false, message: "Invalid booking status." });
        }

        booking.status = status;
        await booking.save();

        return res.status(200).json({ status: true, message: "Booking updated successfully by admin.", data: booking });
    } catch (error) {
        console.log("error in admin booking update controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in admin booking update controller", data: error });
    }
};

const bookingupdateManagerController = async (req, res) => {
    try {
        let { id } = req.params;
        const { status } = req.body;
        const booking = await bookingModel.findById(id);

        if (!booking) {
            return res.status(400).json({ status: false, message: "Booking ID does not exist in the backend.", data: null });
        }

        if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ status: false, message: "Invalid booking status.", data: null });
        }

        const hotel = await hotelModel.findById(booking.hotelId);
        if (!hotel) {
            return res.status(404).json({ status: false, message: "Hotel does not exist.", data: null });
        }

        if (hotel.managerId.toString() !== req.user.userId.toString()) {
            return res.status(400).json({ status: false, message: "You can only update your own hotel bookings.", data: null });
        }

        booking.status = status;
        await booking.save();

        return res.status(200).json({ status: true, message: "Booking updated successfully.", data: booking });
    } catch (error) {
        console.log("error in manager booking update controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in manager booking update controller", data: error });
    }
};

const bookingdeleteController = async (req, res) => {
    try {
        let { id } = req.params;
        const booking = await bookingModel.findById(id);

        if (!booking) {
            return res.status(400).json({ status: false, message: "Booking ID does not exist in the backend.", data: null });
        }

        await bookingModel.findByIdAndDelete(id);

        return res.status(200).json({ status: true, message: "Booking removed successfully.", data: booking });
    } catch (error) {
        console.log("error in booking delete contoller ->", error)
        return res.status(500).json({ status: false, message: "server side error in booking delete contoller", data: error })
    }
}
module.exports = {
    bookingcreateContoller,
    bookingfetchAllAdminController,
    bookingfetchAllManagerController,
    bookingfetchAllGuestController,
    bookingsinglefetchController,
    bookingupdateAdminController,
    bookingupdateManagerController,
    bookingdeleteController
    }