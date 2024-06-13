const Permission = require('../models/PermissionModel')
const User = require('../models/UserModel')

const createPer = async (req, res) => {
    try {
        const { name,
            description,
            canCreateUser,
            canCreatePermission,
            canGetDetailUser,
            canDeleteUser,
            canUpdateUser,
            canGetAllUser } = req.body
        const totalPer = await Permission.countDocuments()
        const token = req.headers.token.split(' ')[1]
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        const createBy = await User.findOne({ _id: decoded.id })
        req.body.createBy = createBy.email
        const newPer = await Permission.create({
            name,
            description,
            canCreateUser,
            canCreatePermission,
            canGetDetailUser,
            canDeleteUser,
            canUpdateUser,
            canGetAllUser,
            level: totalPer
        })
        if (newPer) {
            return res.status(200).json({
                status: "200",
                message: "success",
                data: newPer
            })
        }
    } catch (e) {
        return res.status(400).json({ message: e })
    }
}

const getAllPer = async (req, res) => {
    try {
        const response = await Permission.find()
        if (response) {
            return res.status(200).json({
                status: "200",
                message: "success",
                data: response
            })
        }
    } catch (e) {
        return res.status(400).json({ message: e })
    }
}

const updatePer = async (req, res) => {
    try {
        const userId = req.params.id
        const data = Object.assign({}, req.body);
        const response = await Permission.findByIdAndUpdate(userId, data, { new: true })
        if (response) {
            return res.status(200).json({
                status: "200",
                message: "success",
                data: response
            })
        }
    } catch (e) {
        return res.status(400).json({ message: e })
    }
}

const deletePer = async (req, res) => {
    try {
        const userId = req.params.id
        const response = await Permission.findByIdAndDelete(userId)
        if (response) {
            return res.status(200).json({
                status: "200",
                message: "success",
                data: response
            })
        }
    } catch (e) {
        return res.status(400).json({ message: e })
    }
}

module.exports = {
    createPer,
    getAllPer,
    updatePer,
    deletePer
}