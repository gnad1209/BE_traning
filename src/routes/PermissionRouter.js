const express = require('express')
const routes = express.Router()
const permissionController = require('../controllers/PermissionController')

routes.post('/create-per', permissionController.createPer)
routes.get('/get-all-per', permissionController.getAllPer)
module.exports = routes