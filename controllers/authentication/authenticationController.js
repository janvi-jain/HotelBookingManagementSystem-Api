const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userModel = require('../../models/users/userModel')

const registerController = async (req, res) => {
    console.log(req.body)
    try {
        let { name, email, password, Cpassword, role } = req.body;

        // validator
        if (!name || !email || !password || !Cpassword || !role) {
            return res.status(400).json({ status: false, message: "fields can't be empty", data: null })
        }

        if (!['admin', 'manager', 'guest'].includes(role)) {
            return res.status(400).json({ status: false, message: "Invalid role. Role must be admin, manager or guest.", data: null });
        }

        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ status: false, message: "user already exits..", data: user })
        }

        if (password != Cpassword) {
            return res.status(400).json({ status: false, message: "password didn't match", data: null })
        }

        const hashpassword = await bcrypt.hash(password, 12)

        const registerUser = await userModel.create({ name, email, password: hashpassword, role })

        return res.status(200).json({ status: true, message: "user registered sucessfully..!", data: registerUser })
    } catch (error) {
        console.log("error in registration contoller ->", error)
        return res.status(500).json({ status: false, message: "server side error in registration contoller", data: error })
    }
}

const loginController = async (req, res) => {
    try {
        let { email, password } = req.body

        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ status: false, message: "user not found !! please register yourself ..", data: null })
        }

        const isPassMatch = await bcrypt.compare(password, user.password);

        if (!isPassMatch) {
            return res.status(400).json({ status: false, message: "Password not match.", data: null })
        }

        if (user.status === 'inactive') {
            return res.status(403).json({status: false,message: "Your account is inactive. Please contact admin.",data: null});
        }

        let token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET)

        return res.status(200).json({ status: true, message: "User login succesfull", data: token });
    } catch (error) {
        console.log("error in login contoller ->", error)
        return res.status(500).json({ status: false, message: "server side error in login contoller", data: error })
    }
}

module.exports = { registerController, loginController }