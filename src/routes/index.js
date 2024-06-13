const UserRouter = require('./UserRouter')
const Department = require('./DepartmentRouter')
const Permission = require('./PermissionRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/department', Department)
    app.use('/api/permission', Permission)
}

module.exports = routes
