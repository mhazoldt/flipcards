var express = require('express')
var router = express.Router()

let usersController = require('../controllers/usersController')


// register for api token
router.post('/api/register', usersController.register)

// update token
router.post('/api/token', usersController.token)

module.exports = router