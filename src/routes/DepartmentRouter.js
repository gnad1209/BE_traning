const express = require('express')
const routes = express.Router()
const permissionController = require('../controllers/PermissionController')

routes.post('/create-per', permissionController.createPer)

module.exports = routes