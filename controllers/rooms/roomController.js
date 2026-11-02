const roomModel = require('../../models/rooms/RoomsModel')
const hotelModel = require('../../models/hotels/hotelsModel')
const roomTypeModel = require('../../models/roomTypes/roomTypesModel')

const roomscreateContoller = async (req, res) => {
    try {
        const { hotelId, roomTypeId, name, description, pricePerNight, capacity } = req.body;

        let hotel = await hotelModel.findOne({ _id: hotelId });
        if (!hotel) {
            return res.status(400).json({ status: false, message: "Hotel ID does not exist in the backend." });
        }

        if (hotel.status !== 'approved') {
            return res.status(400).json({ status: false, message: "You can only create rooms for an approved hotel." });
        }

        let roomType = await roomTypeModel.findOne({ _id: roomTypeId });
        if (!roomType) {
            return res.status(400).json({ status: false, message: "Room type ID does not exist in the backend." });
        }

        if (hotel.managerId.toString() !== req.user.userId.toString()) {
            return res.status(400).json({ status: false, message: "You can only create rooms for your own hotel." });
        }

        const image = req.file ? req.file.filename : null;

        const rooms = new roomModel({ hotelId, roomTypeId, name, description, pricePerNight, capacity, image})
        await rooms.save();

        return res.status(200).json({ status: true, message: "Rooms Created SucessFully", data: rooms })
    } catch (error) {
        console.log("error in rooms create contoller ->", error)
        return res.status(500).json({ status: false, message: "server side error in rooms create contoller", data: error })
    }
}

const roomfetchAllAdminController = async (req, res) => {
    try {
        const rooms = await roomModel.find();
        return res.status(200).json({ status: true, message: "All rooms fetched successfully", data: rooms });
    } catch (error) {
        console.log("error in admin fetch all room controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in admin fetch all room controller", data: error });
    }
};

const roomfetchAllManagerController = async (req, res) => {
    try {
        const hotels = await hotelModel.find({ managerId: req.user.userId });
        const hotelIds = hotels.map(hotel => hotel._id);
        const rooms = await roomModel.find({ hotelId: { $in: hotelIds } });

        return res.status(200).json({ status: true, message: "Your rooms fetched successfully", data: rooms });
    } catch (error) {
        console.log("error in manager fetch all room controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in manager fetch all room controller", data: error });
    }
};

const roomfetchAllGuestController = async (req, res) => {
    try {
        const hotels = await hotelModel.find({ status: 'approved' });
        const hotelIds = hotels.map(hotel => hotel._id);

        const rooms = await roomModel.find({ hotelId: { $in: hotelIds }, status: 'approved' });
        return res.status(200).json({ status: true, message: "Approved rooms fetched successfully.", data: rooms });
    } catch (error) {
        console.log("error in guest fetch all room controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in guest fetch all room controller", data: error });
    }
};

const roomssinglefetchController = async (req, res) => {
    try {
        let { id } = req.params;

        const room = await roomModel.findById(id);
        if (!room) {
            return res.status(400).json({ status: false, message: "Room ID does not exist in the backend.", data: null });
        }

        const hotel = await hotelModel.findById(room.hotelId);
        if (!hotel) {
            return res.status(400).json({ status: false, message: "Hotel does not exist.", data: null });
        }

        if (req.user.role === 'manager') {
            if (hotel.managerId.toString() !== req.user.userId.toString()) {
                return res.status(400).json({ status: false, message: "You can only view rooms of your own hotel.", data: null });
            }
        }

        if (req.user.role === 'guest') {
            if (hotel.status !== 'approved' || room.status !== 'approved') {
                return res.status(400).json({ status: false, message: "You can only view approved rooms.", data: null });
            }
        }

        return res.status(200).json({ status: true, message: "Single room fetched successfully.", data: room });
    } catch (error) {
        console.log("error in rooms single fetch controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in rooms single fetch controller", data: error });
    }
};

const roomsupdateManagerController = async (req, res) => {
    try {
        let { id } = req.params;
        const { roomTypeId, name, description, pricePerNight, capacity } = req.body;

        const room = await roomModel.findById(id);
        if (!room) {
            return res.status(404).json({ status: false, message: "Room ID does not exist in the backend.", data: null });
        }

        const hotel = await hotelModel.findById(room.hotelId);
        if (!hotel) {
            return res.status(404).json({ status: false, message: "Hotel does not exist.", data: null });
        }

        if (hotel.managerId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ status: false, message: "You can only update rooms of your own hotel.", data: null });
        }

        if (hotel.status !== 'approved') {
            return res.status(400).json({ status: false, message: "You can only update rooms for an approved hotel.", data: null });
        }

        if (room.status === 'approved') {
            return res.status(400).json({ status: false, message: "Approved room cannot be updated by manager.", data: null });
        }

        const roomType = await roomTypeModel.findById(roomTypeId);
        if (!roomType) {
            return res.status(404).json({ status: false, message: "Room type ID does not exist.", data: null });
        }

        const updatedroom = await roomModel.findByIdAndUpdate(
            id, { roomTypeId, name, description, pricePerNight, capacity, status: "pending", rejectionReason: null }, { new: true }
        );

        return res.status(200).json({ status: true, message: "Room updated successfully. Waiting for admin approval.", data: updatedroom });
    } catch (error) {
        console.log("error in manager room update controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in manager room update controller", data: error });
    }
};

const roomsupdateAdminController = async (req, res) => {
    try {
        let { id } = req.params;
        const { roomTypeId, name, description, pricePerNight, capacity } = req.body;

        const room = await roomModel.findById(id);
        if (!room) {
            return res.status(404).json({ status: false, message: "Room ID does not exist in the backend.", data: null });
        }

        const roomType = await roomTypeModel.findById(roomTypeId);
        if (!roomType) {
            return res.status(404).json({ status: false, message: "Room type ID does not exist.", data: null });
        }

        const updatedroom = await roomModel.findByIdAndUpdate(
            id, { roomTypeId, name, description, pricePerNight, capacity }, { new: true }
        );

        return res.status(200).json({ status: true, message: "Room updated successfully by admin.", data: updatedroom });
    } catch (error) {
        console.log("error in admin room update controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in admin room update controller", data: error });
    }
};

const roomsdeleteManagerController = async (req, res) => {
    try {
        let { id } = req.params;

        const room = await roomModel.findById(id);
        if (!room) {
            return res.status(401).json({ status: false, message: "Room ID does not exist in the backend." });
        }

        const hotel = await hotelModel.findById(room.hotelId);
        if (!hotel) {
            return res.status(400).json({ status: false, message: "Hotel does not exist." });
        }

        if (hotel.managerId.toString() !== req.user.userId.toString()) {
            return res.status(400).json({ status: false, message: "You can only delete rooms of your own hotel." });
        }

        await roomModel.findByIdAndDelete(id);
        return res.status(200).json({ status: true, message: "rooms Removed Sucessfully !!", data: room })
    } catch (error) {
        console.log("error in rooms delete contoller ->", error)
        return res.status(501).json({ status: false, message: "server side error in rooms delete contoller", data: error })
    }
}

const roomsdeleteAdminController = async (req, res) => {
    try {
        let { id } = req.params;

        const room = await roomModel.findById(id);
        if (!room) {
            return res.status(400).json({ status: false, message: "Room ID does not exist in the backend.", data: null });
        }

        await roomModel.findByIdAndDelete(id);

        return res.status(200).json({ status: true, message: "Room removed successfully by admin.", data: room });
    } catch (error) {
        console.log("error in admin room delete controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in admin room delete controller", data: error });
    }
};

const roomsApproveController = async (req, res) => {
    try {
        let { id } = req.params;

        const room = await roomModel.findById(id);
        if (!room) {
            return res.status(401).json({ status: false, message: "Room ID does not exist." });
        }
        if (room.status === 'approved') {
            return res.status(400).json({ status: false, message: "Room is already approved.", data: null });
        }

        const hotel = await hotelModel.findById(room.hotelId);
        if (!hotel) {
            return res.status(404).json({status: false,message: "Hotel does not exist in the backend.",data: null});
        }
        if (hotel.status !== 'approved') {
            return res.status(400).json({status: false,message: "You can only approve rooms of an approved hotel.",data: null});
        }

        room.status = "approved";
        room.rejectionReason = null;
        await room.save();
        return res.status(200).json({ status: true, message: "Room approved successfully.", data: room });
    } catch (error) {
        console.log("error in room approve controller ->", error);
        return res.status(500).json({ status: false, message: "server side error in room approve controller", data: error });
    }
};

const roomsRejectController = async (req, res) => {
    try {
        let { id } = req.params;
        
        const { rejectionReason } = req.body;
        if (!rejectionReason) {
            return res.status(400).json({ status: false, message: "Rejection reason is required." });
        }

        const room = await roomModel.findById(id);
        if (!room) {
            return res.status(401).json({ status: false, message: "Room ID does not exist." });
        }

        if (room.status === 'rejected') {
            return res.status(400).json({ status: false, message: "Room is already rejected.", data: null });
        }

        room.status = "rejected";
        room.rejectionReason = rejectionReason;
        await room.save();

        return res.status(200).json({ status: true, message: "Room rejected successfully.", data: room });
    } catch (error) {
        console.log("error in room reject controller ->", error);
        return res.status(500).json({ status: false, message: "server side error in room reject controller", data: error });
    }
};


module.exports = {
    roomscreateContoller,
    roomfetchAllAdminController,
    roomfetchAllManagerController,
    roomfetchAllGuestController,
    roomssinglefetchController,
    roomsupdateAdminController,
    roomsupdateManagerController,
    roomsdeleteManagerController,
    roomsdeleteAdminController,
    roomsApproveController,
    roomsRejectController
}