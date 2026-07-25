const express = require('express')
const router = express.Router()
const { getSetlistsByCelebrity } = require('../controllers/setListController.js')

router.get('/celebrity/:id', getSetlistsByCelebrity)

module.exports = router