const express = require('express')
const router = express.Router()
const authenthicateUser = require('../middleware/Authenthication')
const {getCurrentUser} = require('../controllers/user')

router.get("/me", authenthicateUser, getCurrentUser);

module.exports = router