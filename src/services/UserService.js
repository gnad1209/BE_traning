const User = require('../models/UserModel')
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require('../services/JwtService')
const dotenv = require("dotenv")
dotenv.config()
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const signUp = (data) => {
    return new Promise(async (resolve, reject) => {
        const { email, password, confirmPassword } = data
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: "ERR",
                    message: "the email is already"
                })
            }
            const name = email.split('@')[0]
            console.log(name)
            const hash = bcrypt.hashSync(password, 10);
            const createUser = await User.create({
                email,
                name,
                password: hash,
            })
            if (createUser) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createUser
                })
            }
            resolve({})
        } catch (e) {
            reject(e)
        }
    })
}

const signIn = (data) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = data
        try {
            //tìm kiếm user trong db
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: "ERR",
                    message: "the email is not defined"
                })
            }
            //mã hóa password
            const comparePassword = bcrypt.compare(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: "ERR",
                    message: "the password is incorrect"
                })
            }
            //tạo access_token
            const access_token = await genneralAccessToken({
                id: checkUser?.id,
                isAdmin: checkUser?.isAdmin
            })
            //tạo refresh_token
            const refresh_token = await genneralRefreshToken({
                id: checkUser?.id,
                isAdmin: checkUser?.isAdmin
            })
            resolve({
                status: "OK",
                message: "SUCCESS",
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalUser = await User.countDocuments()
            if (filter) {
                const objectFilter = {}
                objectFilter[filter[1]] = filter[0]
                const lable = filter[0]
                const getAllUserFilter = await User.find({ isDelete: false, [lable]: { '$regex': filter[1] } }).limit(limit).skip(page * limit)
                resolve({
                    status: "OK",
                    message: "Success",
                    data: getAllUserFilter,
                    total: totalUser,
                    pageCurent: page + 1,
                    totalPage: Math.ceil(totalUser / limit)
                })
            }
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const getAllUserSort = await User.find({ isDelete: false }).limit(limit).skip(page * limit).sort(objectSort)
                resolve({
                    status: "OK",
                    message: "SUCCESS",
                    data: getAllUserSort,
                    total: totalUser,
                    pageCurrent: page + 1,
                    totalPage: Math.ceil(totalUser / limit)
                })
            }
            const getAllUser = await User.find({ isDelete: false }).limit(limit).skip(page * limit)
            resolve({
                status: "OK",
                message: "SUCCESS",
                data: getAllUser,
                total: totalUser,
                pageCurrent: page + 1,
                totalPage: Math.ceil(totalUser / limit)
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateUser = async (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = User.findOne({
                _id: id
            })
            if (!checkUser) {
                return resolve.status(400).json({
                    status: 400,
                    message: "user is not defined"
                })
            }
            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: "ok",
                message: "success",
                data: updateUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const uploadImage = (file) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!file) {
                return resolve({
                    status: "404",
                    message: "no image file provided"
                })
            }
            cloudinary.uploader.upload_stream({ folder: 'lifetek' }, (error, result) => {
                if (error) {
                    return resolve({
                        status: "404",
                        message: "upload file failed"
                    })
                }
                return resolve({ public_id: result.public_id, url: result.secure_url });
            }).end(file.buffer);
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id })
            if (!checkUser) {
                resolve({
                    status: "fail",
                    message: "user is not defined"
                })
            }
            await User.findByIdAndUpdate(id, { isDelete: true }, { new: true })
            resolve({
                status: "200",
                message: "delete success!!"
            })
        } catch (e) {
            reject(e)
        }
    })
}

const detailUser = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id })
            if (!checkUser) {
                resolve({
                    status: "fail",
                    message: "user is not defined"
                })
            }
            resolve({
                status: "200",
                message: "success!!",
                data: checkUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    signUp,
    signIn,
    getAllUser,
    updateUser,
    uploadImage,
    deleteUser,
    detailUser
}