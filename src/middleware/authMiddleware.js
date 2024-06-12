const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

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

module.exports = {
    authMiddleware
}