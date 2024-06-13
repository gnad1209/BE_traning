const express = require("express");
const dotenv = require('dotenv')
const mongoose = require("mongoose");
// const db = require('./config/db');
const routes = require('./routes');
const bodyParser = require("body-parser");
const cors = require('cors')
const cookieParser = require("cookie-parser")
dotenv.config()
const Permission = require('./models/PermissionModel');
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json())
app.use(cookieParser())

routes(app)

mongoose.connect(`${process.env.MONGO_db}`)
    .then(() => {
        console.log('connect success!')
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(port, () => {
    console.log(`server is running with port: ${port}`)
})