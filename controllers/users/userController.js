const userModel = require('../../models/users/userModel');
const hotelModel = require('../../models/hotels/hotelsModel');
const bookingModel = require('../../models/bookings/bookingsModel');

const userfetchAllAdminController = async (req, res) => {
    try {
        const users = await userModel.find();
        return res.status(200).json({ status: true, message: "All users fetched successfully.", data: users });
    } catch (error) {
        console.log("error in user fetch all admin controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in user fetch all admin controller.", data: error });
    }
};

const userfetchAllManagerController = async (req, res) => {
    try {
        const hotels = await hotelModel.find({ managerId: req.user.userId });
        const hotelIds = hotels.map(hotel => hotel._id);

        const bookings = await bookingModel.find({ hotelId: { $in: hotelIds } });
        const guestIds = bookings.map(booking => booking.guestId);

        const users = await userModel.find({ _id: { $in: guestIds } });

        return res.status(200).json({ status: true, message: "Manager's hotel guests fetched successfully.", data: users });
    } catch (error) {
        console.log("error in user fetch all manager controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in user fetch all manager controller.", data: error });
    }
};

const userfetchAllGuestController = async (req, res) => {
    try {
        const users = await userModel.find({ _id: req.user.userId });
        return res.status(200).json({ status: true, message: "Guest information fetched successfully.", data: users });
    } catch (error) {
        console.log("error in user fetch all guest controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in user fetch all guest controller.", data: error });
    }
};

const usersinglefetchController = async (req, res) => {
    try {
        let { id } = req.params;

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(401).json({status: false,message: "User does not exist.",data: null});
        }

        if (req.user.role === 'admin') {
            if (user.role === 'admin' && user._id.toString() !== req.user.userId.toString()){
                return res.status(401).json({ status: false,message: "Admin cannot view another admin.",data: null});
            }

            return res.status(200).json({status: true,message: "User fetched successfully.",data: user});
        }

        if (req.user.role === 'guest') {
            if (user._id.toString() !== req.user.userId.toString()) {
                return res.status(401).json({status: false,message: "Guest can only view own information.",data: null});
            }

            return res.status(200).json({status: true,message: "User fetched successfully.",data: user});
        }

        if (req.user.role === 'manager') {
            if (user._id.toString() === req.user.userId.toString()) {
                return res.status(200).json({status: true,message: "User fetched successfully.",data: user});
            }

            if (user.role !== 'guest') {
                return res.status(401).json({status: false,message: "Manager cannot view this user.",data: null});
            }

            const hotel = await hotelModel.findOne({managerId: req.user.userId});
            if (!hotel) {
                return res.status(401).json({status: false,message: "You cannot view this guest.",data: null});
            }

            const booking = await bookingModel.findOne({hotelId: hotel._id,guestId: user._id});
            if (!booking) {
                return res.status(401).json({status: false,message: "You cannot view this guest.",data: null});
            }

            return res.status(200).json({status: true,message: "User fetched successfully.",data: user});
        }

    } catch (error) {
        console.log("error in user single fetch controller ->", error);
        return res.status(500).json({status: false,message: "Server side error in user single fetch controller.",data: error});
    }
};

const userupdateAdminController = async (req, res) => {
    try {
        let { id } = req.params;
        const { name, email, role, status } = req.body;

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({status: false,message: "User does not exist.",data: null});
        }

        if (user.role === 'admin' && user._id.toString() !== req.user.userId.toString()) {
            return res.status(403).json({status: false,message: "Admin cannot update another admin.",data: null});
        }

        if (role && !['admin', 'manager', 'guest'].includes(role)) {
            return res.status(400).json({status: false,message: "Invalid role.",data: null});
        }

        if (status && !['active', 'inactive'].includes(status)) {
            return res.status(400).json({status: false,message: "Invalid status.",data: null});
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.status = status || user.status;

        await user.save();
        return res.status(200).json({status: true,message: "User updated successfully.",data: user});
    } catch (error) {
        console.log("error in user update admin controller ->", error);
        return res.status(500).json({status: false,message: "Server side error in user update admin controller.",data: error});
    }
};

const userdeleteAdminController = async (req, res) => {
    try {
        let { id } = req.params;

        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({status: false,message: "User does not exist.",data: null});
        }

        if (user.role === 'admin' && user._id.toString() !== req.user.userId.toString()){
            return res.status(403).json({status: false,message: "Admin cannot delete another admin.",data: null});
        }

        await userModel.findByIdAndDelete(id);
        return res.status(200).json({status: true,message: "User deleted successfully.",data: user});
    } catch (error) {
        console.log("error in user delete admin controller ->", error);
        return res.status(500).json({status: false,message: "Server side error in user delete admin controller.",data: error});
    }
};

module.exports = {
    userfetchAllAdminController,
    userfetchAllManagerController,
    userfetchAllGuestController,
    usersinglefetchController,
    userupdateAdminController,
    userdeleteAdminController
} 