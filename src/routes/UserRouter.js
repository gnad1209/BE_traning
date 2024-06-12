const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage })
const { authMiddleware } = require('../middleware/authMiddleware')

router.post('/sign-up', userController.signUp)
router.post('/sign-in', userController.signIn)
router.get('/getAll', authMiddleware, userController.getAllUser)
router.delete('/delete/:id', userController.deleteUser)
router.put('/update/:id', upload.single('avatar'), userController.updateUser)
// router.post('/sign-up', userController.signUp)
module.exports = router