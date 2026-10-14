const mongoose = require('mongoose');

const database =async () => {
    try {
        await mongoose.connect(process.env.MODE == 'production' ? process.env.PRD_DB_URL : process.env.DEV_DB_URL)
        console.log('database connected'); 
    } catch (error) {
        console.log('database not connected'); 
        return res.status(500).json({ status: false, message: "server side error database not connected", data: error })   
    }
}

module.exports = database;