const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    managerId :  {
        type : mongoose.Schema.ObjectId,
        ref : "HotelUsers",
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
    location :{
        type:String,
        required :true
    },
    contactInfo :{
        type:String,
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
        required :true
    },
    rejectionReason: {
        type: String,
        default: null,
    }
},{timestamps:true})

const HotelsModel = mongoose.model('Hotels',hotelSchema)

module.exports = HotelsModel;