const userService = require('../services/UserService')
const jwtService = require('../services/JwtService')
const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
const dotenv = require("dotenv")
dotenv.config()

const signUp = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body
        //sử dụng biểu thức chính quy kiêm tra email
        const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const isCheckMail = reg.test(email)
        //kiểm tra có các trường cần nhập  chưa
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                status: "ERR",
                message: "nhập đủ tên hoặc mật khẩu",
            })

        }
        //kiểm tra email hợp lệ
        else if (!isCheckMail) {
            return res.status(400).json({
                status: "ERR",
                message: "nhập sai email"
            })
        }
        //kiểm tra xác nhận mật khẩu có trùng không 
        else if (password !== confirmPassword) {
            return res.status(400).json({
                status: "ERR",
                message: "mật khẩu không trùng khớp"
            })
        }
        //gọi signup ở service và truyền vào req.body
        const response = await userService.signUp(req.body)
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json()
    }
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body
        //sử dụng biểu thức chính quy kiêm tra email
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const ischeckMail = reg.test(email)
        if (!email || !password) {
            return res.status(400).json({
                status: "400",
                message: "nhập email và mật khẩu"
            })
        } else if (!ischeckMail) {
            return res.status(400).json({
                status: "400",
                message: "nhập lại email"
            })
        }
        const response = await userService.signIn(req.body)
        const { refresh_token, ...newResponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/',
        })
        return res.status(200).json({ ...newResponse, refresh_token })
    } catch (e) {
        return res.status(400).json({
            message: e
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = Object.assign({}, req.body);
        const file = req.file
        const token = req.headers.token.split(' ')[1]
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        const updateBy = await User.findOne({ _id: decoded.id })
        //kiểm tra id
        if (!userId) {
            return res.status(400).json({
                status: '400',
                message: 'the userid is required'
            })
        }
        const upload = await userService.uploadImage(file)
        data.avatar = upload.url
        data.updateBy = updateBy.email
        const response = await userService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(400).json({
            messgae: e
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        const response = await userService.getAllUser(Number(limit) || 8, Number(page) || 0, sort, filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(400).json({ message: e })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        const response = await userService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(400).json({ message: e })
    }
}

const detailUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                status: "ERR",
                message: "user is not defined"
            })
        }
        const response = await userService.detailUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(400).json({ message: e })
    }
}

const refreshToken = async (req, res) => {
    try {
        let token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await jwtService.refreshToken(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        //xóa refresh token khỏi cookie
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout success'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const createUser = async (req, res) => {
    try {
        const token = req.headers.token.split(' ')[1]
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        const createBy = await User.findOne({ _id: decoded.id })
        req.body.createBy = createBy.email
        const { email, password, confirmPassword, isAdmin } = req.body
        //sử dụng biểu thức chính quy kiêm tra email
        const reg = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        const isCheckMail = reg.test(email)

        //kiểm tra có các trường cần nhập  chưa
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({
                status: "ERR",
                message: "nhập đủ tên hoặc mật khẩu",
            })

        }
        //kiểm tra email hợp lệ
        else if (!isCheckMail) {
            return res.status(400).json({
                status: "ERR",
                message: "nhập sai email"
            })
        }
        //kiểm tra xác nhận mật khẩu có trùng không 
        else if (password !== confirmPassword) {
            return res.status(400).json({
                status: "ERR",
                message: "mật khẩu không trùng khớp"
            })
        }
        //gọi signup ở service và truyền vào req.body
        const response = await userService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    signUp,
    signIn,
    updateUser,
    getAllUser,
    deleteUser,
    detailUser,
    refreshToken,
    logoutUser,
    createUser
}