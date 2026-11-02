const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    hotelId :  {
        type : mongoose.Schema.ObjectId,
        ref : "Hotels",
        required :true
    },
    roomTypeId :  {
        type : mongoose.Schema.ObjectId,
        ref : "HotelRoomTypes",
        required :true
    },
    name :{
        type:String,
        required :true
    },
    description :{
        type:String,
        required :true
    },
    pricePerNight :{
        type:Number,
        required :true
    },
    capacity :{
        type:Number,
        required :true
    },
    image :{
        type:String,
        required :true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        required: true
    },

    rejectionReason: {
        type: String,
        default: null
    }

},{timestamps:true})

const roomModel = mongoose.model('HotelRooms',roomSchema)

module.exports = roomModel;