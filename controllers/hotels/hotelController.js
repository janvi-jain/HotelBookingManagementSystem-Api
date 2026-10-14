const hotelModel = require('../../models/hotels/hotelsModel')
const userModel = require('../../models/users/userModel')
const roomModel = require('../../models/rooms/RoomsModel');

const hotelcreateContoller = async (req, res) => {
    try {
        const { name, description, location, contactInfo } = req.body;

        const managerId = req.user.userId;

        const user = await userModel.findById(managerId);
        if (!user) {
            return res.status(404).json({ status: false, message: "Manager does not exist." });
        }

        const image = req.file ? req.file.filename : null;

        const hotel = new hotelModel({ managerId, name, description, location, contactInfo, image });
        await hotel.save();

        return res.status(200).json({ status: true, message: "Hotel Created Successfully", data: hotel });
    } catch (error) {
        console.log("Error in hotel create controller ->", error);
        return res.status(500).json({ status: false, message: "Server-side error in hotel create controller", data: error });
    }
}

const hotelfetchAllAdminController = async (req, res) => {
    try {
        const hotels = await hotelModel.find();
        return res.status(200).json({ status: true, message: "All hotels fetched successfully", data: hotels });
    } catch (error) {
        console.log("error in admin fetch all hotel controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in admin fetch all hotel controller", data: error });
    }
};

const hotelfetchAllManagerController = async (req, res) => {
    try {
        const hotels = await hotelModel.find({ managerId: req.user.userId });
        return res.status(200).json({ status: true, message: "Your hotels fetched successfully", data: hotels });
    } catch (error) {
        console.log("error in manager fetch all hotel controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in manager fetch all hotel controller", data: error });
    }
};

const hotelfetchAllGuestController = async (req, res) => {
    try {
        const hotels = await hotelModel.find({ status: 'approved' });
        return res.status(200).json({ status: true, message: "Approved hotels fetched successfully", data: hotels });
    } catch (error) {
        console.log("error in guest fetch all hotel controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in guest fetch all hotel controller", data: error });
    }
};

const hotelsinglefetchController = async (req, res) => {
    try {
        let { id } = req.params;

        const hotel = await hotelModel.findById(id);
        if (!hotel) {
            return res.status(404).json({ status: false, message: "Hotel ID does not exist.", data: null });
        }

        if (req.user.role === 'guest') {
            if (hotel.status !== 'approved') {
                return res.status(403).json({ status: false, message: "You can only view approved hotels.", data: null });
            }
        }

        if (req.user.role === 'manager') {
            if (hotel.managerId.toString() !== req.user.userId.toString()) {
                return res.status(403).json({ status: false, message: "You can only view your own hotel.", data: null });
            }
        }

        return res.status(200).json({ status: true, message: "Hotel fetched successfully.", data: hotel });
    } catch (error) {
        console.log("error in hotel single fetch controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in hotel single fetch controller", data: error });
    }
};

const hotelupdateAdminController = async (req, res) => {
    try {
        let { id } = req.params;
        const { name, description, location, contactInfo } = req.body;

        const hotel = await hotelModel.findById(id);
        if (!hotel) {
            return res.status(404).json({ status: false, message: "Hotel ID does not exist in the backend.", data: null });
        }

        const updatedhotel = await hotelModel.findByIdAndUpdate(id, { name, description, location, contactInfo }, { new: true });
        return res.status(200).json({ status: true, message: "Hotel updated successfully by admin.", data: updatedhotel });
    } catch (error) {
        console.log("error in admin hotel update controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in admin hotel update controller", data: error });
    }
};

const hotelupdateManagerController = async (req, res) => {
    try {
        let { id } = req.params;
        const { name, description, location, contactInfo } = req.body;

        const hotel = await hotelModel.findById(id);
        if (!hotel) {
            return res.status(404).json({ status: false, message: "Hotel ID does not exist in the backend.", data: null });
        }

        if (hotel.managerId.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ status: false, message: "You can only update your own hotel.", data: null });
        }   
        
        hotel.name = name || hotel.name;
        hotel.description = description || hotel.description;
        hotel.location = location || hotel.location;
        hotel.contactInfo = contactInfo || hotel.contactInfo;

        hotel.status = 'pending';
        hotel.rejectionReason = null;

        await hotel.save();
        return res.status(200).json({status: true,message: "Hotel updated successfully and sent for approval.",data: hotel
        });
    } catch (error) {
        console.log("error in manager hotel update controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in manager hotel update controller", data: error });
    }
};

const hoteldeleteManagerController = async (req, res) => {
    try {
        let { id } = req.params;

        let hotel = await hotelModel.findById(id);
        if (!hotel) {
            return res.status(400).json({ status: false, message: "Hotel ID does not exist in the backend." });
        }

        if (hotel.managerId.toString() !== req.user.userId.toString()) {
            return res.status(400).json({ status: false, message: "You can only delete your own hotel." });
        }

        await hotelModel.findByIdAndDelete(id);

        return res.status(200).json({ status: true, message: "Hotel removed successfully by Manager", data: hotel });
    } catch (error) {
        console.log("error in hotel delete controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in hotel delete controller", data: error });
    }
};

const hoteldeleteAdminController = async (req, res) => {
    try {
        let { id } = req.params;
        const hotel = await hotelModel.findById(id);
        if (!hotel) {
            return res.status(400).json({ status: false, message: "Hotel ID does not exist in the backend.", data: null });
        }

        await hotelModel.findByIdAndDelete(id);
        return res.status(200).json({ status: true, message: "Hotel removed successfully by admin.", data: hotel });

    } catch (error) {
        console.log("error in admin hotel delete controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in admin hotel delete controller", data: error });
    }
};

const hotelApproveController = async (req, res) => {
    try {
        let { id } = req.params;

        const hotel = await hotelModel.findById(id);
        if (!hotel) {
            return res.status(400).json({ status: false, message: "Hotel ID does not exist." });
        }

        hotel.status = "approved";
        hotel.rejectionReason = null;

        await hotel.save();
        return res.status(200).json({ status: true, message: "Hotel approved successfully.", data: hotel });
    } catch (error) {
        console.log("error in hotel approve controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in hotel approve controller", data: error });
    }
};


const hotelRejectController = async (req, res) => {
    try {
        let { id } = req.params;
        const { rejectionReason } = req.body;

        if (!rejectionReason) {
            return res.status(400).json({ status: false, message: "Rejection reason is required." });
        }

        const hotel = await hotelModel.findById(id);
        if (!hotel) {
            return res.status(400).json({ status: false, message: "Hotel ID does not exist." });
        }

        hotel.status = "rejected";
        hotel.rejectionReason = rejectionReason;
        
        await hotel.save();
        return res.status(200).json({ status: true, message: "Hotel rejected successfully.", data: hotel });
    } catch (error) {
        console.log("error in hotel reject controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in hotel reject controller", data: error });
    }
};

const hotelSearchFilterController = async (req, res) => {
    try {
        const { location, roomTypeId, minPrice, maxPrice } = req.query;
        let hotels = await hotelModel.find({ status: "approved" });

        if (location) {
            hotels = hotels.filter(hotel =>
                hotel.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        if (roomTypeId || minPrice || maxPrice) {
            let rooms = await roomModel.find({ status: "approved" });
            if (roomTypeId) {
                rooms = rooms.filter(room =>
                    room.roomTypeId.toString() === roomTypeId
                );
            }

            if (minPrice) {
                rooms = rooms.filter(room =>
                    room.pricePerNight >= Number(minPrice)
                );
            }

            if (maxPrice) {
                rooms = rooms.filter(room =>
                    room.pricePerNight <= Number(maxPrice)
                );
            }

            const hotelIds = rooms.map(room =>
                room.hotelId.toString()
            );

            hotels = hotels.filter(hotel =>
                hotelIds.includes(hotel._id.toString())
            );
        }
        return res.status(200).json({ status: true, message: "Hotels searched successfully.", data: hotels });
    } catch (error) {
        console.log("error in hotel search filter controller ->", error);
        return res.status(500).json({ status: false, message: "Server side error in hotel search filter controller", data: error });
    }
};


module.exports = {
    hotelcreateContoller,
    hotelfetchAllAdminController,
    hotelfetchAllManagerController,
    hotelfetchAllGuestController,
    hotelsinglefetchController,
    hotelupdateAdminController,
    hotelupdateManagerController,
    hoteldeleteAdminController,
    hoteldeleteManagerController,
    hotelApproveController,
    hotelRejectController,
    hotelSearchFilterController
}