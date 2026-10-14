const mongoose = require('mongoose');

const RoomTypesSchema = new mongoose.Schema({
    typeName :{
        type:String,
        required :true,
    },
    description :{
        type:String,
        required :true
    }
},{timestamps:true})

const RoomTypesModel = mongoose.model('HotelRoomTypes',RoomTypesSchema)

module.exports = RoomTypesModel;