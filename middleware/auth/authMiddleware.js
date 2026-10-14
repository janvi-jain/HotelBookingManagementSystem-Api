const jwt = require('jsonwebtoken')
const userModel = require('../../models/users/userModel');

const authenticate = async(req,res,next) => {
    try {
        let token = req.headers.authorization;

        if(!token) {
            return res.status(400).json({ status: false, message: "Token required", data: null })
        }

        if(!token.includes('Bearer')) {
            return res.status(400).json({ message: "Token invaild", data: null });
        }

        let authToken = token.split(' ')[1];
        let tokenVerify = await jwt.verify(authToken,process.env.JWT_SECRET);
        //tokenVerify = id,role

        const user = await userModel.findById(tokenVerify.userId);
        if (!user) {
            return res.status(401).json({status: false,message: "User not found",data: null});
        }

        if (user.status === 'inactive') {
            return res.status(403).json({status: false,message: "Your account is inactive. Please contact admin.",data: null});
        }

        req.user = tokenVerify;
        next()
    } catch (error) {
        console.log("error in authenticate middleware ->", error)
        return res.status(500).json({ status: false, message: "server side error in authenticate middleware", data: error })
    }
}

const authorization = (role) => {
    return async(req,res,next) => {
        try {
        if(!req.user || !req.user.role) {
            return res.status(401).json({ status: false, message: "not authorized", data: null })
        }

        if(!role.includes(req.user.role)) {
            return res.status(401).json({ status: false, message: "not allowed", data: null })
        }

        next()
    } catch (error) {
        console.log("error in authorization middleware ->", error)
         return res.status(500).json({ status: false, message: "server side error in authorization middleware", data: error })
    }
}
}

module.exports = {authenticate,authorization};
