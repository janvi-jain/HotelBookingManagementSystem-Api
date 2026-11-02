const roomTypesModel = require('../../models/roomTypes/roomTypesModel')

const roomTypecreateContoller = async (req, res) => {
    try {
        const { name, description } = req.body;
        const roomType = new roomTypesModel({
            typeName: name,
            description
        })

        await roomType.save();

        return res.status(200).json({ status: true, message: "Room-type Created SucessFully", data: roomType })
    } catch (error) {
        console.log("error in room type create contoller ->", error)
        return res.status(500).json({ status: false, message: "server side error in room type create contoller", data: error })
    }
}

const roomTypefetchAllController = async (req, res) => {
    try {
        const roomType = await roomTypesModel.find();
        return res.status(200).json({ status: true, message: "All Room-type featched SucessFully", data: roomType })

    } catch (error) {
        console.log("error in room type fetch All contoller ->", error)
        return res.status(500).json({ status: false, message: "server side error in room type fetch All contoller", data: error })
    }
}

const roomTypesinglefetchController = async (req, res) => {
    try {
        let { id } = req.params;
        const roomType = await roomTypesModel.findById(id);

        if (!roomType) {
            return res.status(404).json({ status: false, message: "roomType ID does not exist in the backend.", data: null });
        }
        return res.status(200).json({ status: true, message: "Single Room-type featched SucessFully", data: roomType })

    } catch (error) {
        console.log("error in room type single fetch contoller ->", error)
        return res.status(500).json({ status: false, message: "server side error in room type single fetch contoller", data: error })
    }
}

const roomTypeupdateController = async (req, res) => {
    try {
        let { id } = req.params;
        const { name, description } = req.body;
        let roomType = await roomTypesModel.findOne({ _id: id })
        if (!roomType) {
            return res.status(404).json({ status: false, message: "roomType ID does not exist in the backend." });
        }

        const updatedRoomType = await roomTypesModel.findByIdAndUpdate(id, { typeName: name, description }, { new: true })

        return res.status(200).json({ status: true, message: "Room-type updated SucessFully ", data: updatedRoomType })
    } catch (error) {
        console.log("error in room type update contoller ->", error)
        return res.status(500).json({ status: false, message: "server side error in room type update contoller", data: error })
    }
}

const roomTypedeleteController = async (req, res) => {
    try {
        let { id } = req.params;
        let roomType = await roomTypesModel.findByIdAndDelete(id);
        
        if (!roomType) {
            return res.status(404).json({ status: false, message: "roomType ID does not exist in the backend.", data: null });
        }
        return res.status(200).json({ status: true, message: "room type Removed Sucessfully !!", data: roomType })
    } catch (error) {
        console.log("error in room type delete  contoller ->", error)
        return res.status(500).json({ status: false, message: "server side error", data: error })
    }
}

module.exports = {
    roomTypecreateContoller,
    roomTypefetchAllController,
    roomTypesinglefetchController,
    roomTypeupdateController,
    roomTypedeleteController 
}