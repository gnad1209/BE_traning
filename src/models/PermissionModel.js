const mongoose = require('mongoose');
const timestampPlugin = require('../middleware/setTimeMiddleware')

const permissionSchema = new mongoose.Schema({
    level: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    canCreateUser: {
        type: Boolean,
        default: false,
    },
    canCreatePermission: {
        type: Boolean,
        default: false,
    },
    canGetDetailUser: {
        type: Boolean,
        default: false,
    },
    canDeleteUser: {
        type: Boolean,
        default: false,
    },
    canUpdateUser: {
        type: Boolean,
        default: false,
    },
    canGetAllUser: {
        type: Boolean,
        default: false,
    },
    createBy: {
        type: String,
    },
    updateBy: {
        type: String,
    },
    // Các quyền khác nếu cần
}, {
    timestamps: true
});
permissionSchema.plugin(timestampPlugin)

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
