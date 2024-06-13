const User = require('../models/UserModel');
const Permission = require('../models/PermissionModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config()

const checkPermission = (action) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.token.split(' ')[1]
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
            const userId = decoded.id;
            console.log("userID:", userId)
            const user = await User.findById(userId).populate('permission');

            if (!user || !user.permission) {
                return res.status(403).json({ message: 'Permission denied' });
            }

            const permission = user.permission;

            switch (action) {
                case 'create-user':
                    if (!permission.canCreateUser) {
                        return res.status(403).json({ message: 'Permission denied' });
                    }
                    break;
                case 'create-permission':
                    if (!permission.canCreatePermission) {
                        return res.status(403).json({ message: 'Permission denied' });
                    }
                    break;
                case 'getDetail':
                    if (!permission.canGetDetailUser) {
                        return res.status(403).json({ message: 'Permission denied' });
                    }
                    break;
                case 'getAll':
                    if (!permission.canGetAllUser) {
                        return res.status(403).json({ message: 'Permission denied' });
                    }
                    break;
                case 'update':
                    if (!permission.canUpdateUser) {
                        return res.status(403).json({ message: 'Permission denied' });
                    }
                    break;
                case 'delete':
                    if (!permission.canDeleteUser) {
                        return res.status(403).json({ message: 'Permission denied' });
                    }
                    break;
                default:
                    return res.status(400).json({ message: 'Invalid action' });
            }

            next();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = checkPermission;
