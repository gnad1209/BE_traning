const mongoose = require('mongoose')
const shortid = require('shortid');
const slug = require('mongoose-slug-generator');
const moment = require('moment')
const timestampPlugin = require('../middleware/setTimeMiddleware')
const blockCreateBy = require('../middleware/blockCreateBy')
mongoose.plugin(slug);

const userSchema = new mongoose.Schema({
    name: { type: String, maxLenght: 20 },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    birthDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return moment(value).isBefore(moment(), 'day');
            },
            message: 'birthDate must be before the current date'
        }
    },
    // avatar: { data: Buffer, contentType: String },
    avatar: { type: String },
    isAdmin: { type: Number, default: 0 },
    permission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
    },
    isDelete: { type: Boolean, default: false },
    createBy: { type: String },
    updateBy: { type: String },
    shortid: { type: String, unique: true, default: shortid.generate },
    slug: { type: String, slug: ['name', 'shortid'] },
}, { timestamps: true })
userSchema.plugin(timestampPlugin)

//chặn update createBy
// Middleware để chặn cập nhật trường createdBy
blockCreateBy(userSchema)

const User = mongoose.model('User', userSchema)

module.exports = User
