const express = require('express')
const router = express.Router()
const {generateQRCode} = require('../controllers/qrImage')

router.get("/:ticketNumber", generateQRCode);


module.exports = router