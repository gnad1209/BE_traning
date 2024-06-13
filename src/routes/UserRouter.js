const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const checkPermission = require('../middleware/Permission');
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware')
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage })

router.post('/sign-up', userController.signUp)
router.post('/createUser', checkPermission('create'), authMiddleware, userController.createUser)
router.post('/sign-in', userController.signIn)
router.get('/getAll', authMiddleware, checkPermission('getAll'), userController.getAllUser)
router.delete('/delete/:id', authMiddleware, userController.deleteUser)
router.put('/update/:id', authUserMiddleware, checkPermission('update'), upload.single('avatar'), userController.updateUser)
router.get('/detail/:id', authUserMiddleware, checkPermission('getDetail'), userController.detailUser)
router.post('/refresh-token', userController.refreshToken)
router.post('/log-out', userController.logoutUser)

module.exports = router