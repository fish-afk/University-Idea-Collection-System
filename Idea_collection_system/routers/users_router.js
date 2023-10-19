const userController = require('../controllers/users')
const express = require("express");

const router = express.Router()

router.get('/signup', userController.signup)
router.post('/login', userController.login)

module.exports = router;