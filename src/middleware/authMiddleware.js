const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

//middleware kiểm tra admin
const authMiddleware = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        console.log(err)
        if (err) {
            return res.status(400).json({
                status: 400,
                message: "the authencaiton"
            })
        }
        if (user?.isAdmin) {
            next()
        }
        else {
            return res.status(400).json({
                status: 400,
                message: "the authencaiton2"
            })
        }
    })
}
//middleware kiểm tra admin và user

const authUserMiddleware = (req, res, next) => {
    const token = req.headers.token.split(' ')[1]
    const userId = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        console.log(err)
        if (err) {
            return res.status(400).json({
                status: 400,
                message: "the authencaiton"
            })
        }
        if (user?.isAdmin || user?.id === userId) {
            req.token = token;
            req.user = user
            next()
        }
        else {
            return res.status(400).json({
                status: 400,
                message: "the authencaiton2"
            })
        }
    })
}

module.exports = {
    authMiddleware,
    authUserMiddleware
}