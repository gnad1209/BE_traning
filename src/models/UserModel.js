const mongoose = require('mongoose')
const shortid = require('shortid');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);

const userSchema = new mongoose.Schema({
    name: { type: String, maxLenght: 20 },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    birthDate: { type: Date },
    // avatar: { data: Buffer, contentType: String },
    avatar: { type: String },
    isAdmin: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    shortid: { type: String, unique: true, default: shortid.generate },
    slug: { type: String, slug: ['name', 'shortid'] },
}, {
    timestamps: true,
})
const User = mongoose.model('User', userSchema)

module.exports = User
