const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage })
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware')

router.post('/sign-up', userController.signUp)
router.post('/sign-in', userController.signIn)
router.get('/getAll', userController.getAllUser)
router.delete('/delete/:id', authMiddleware, userController.deleteUser)
router.put('/update/:id', authUserMiddleware, upload.single('avatar'), userController.updateUser)
router.get('/detail/:id', authUserMiddleware, userController.detailUser)
router.post('/refresh-token', userController.refreshToken)
router.post('/log-out',userController.logoutUser)

module.exports = router