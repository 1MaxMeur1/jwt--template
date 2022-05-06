const Router = require('express')
const userController = require('../controllers/user-controllers')
const router = new Router()
const {body} = require('express-validator')
const authMiddleware = require('../middleware/auth-meddleware')

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/activate/:link', userController.activate)
router.post('/refresh', userController.refresh)
router.post('/users', authMiddleware, userController.getUsers)

module.exports = router