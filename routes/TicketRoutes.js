const express = require('express')
const router = express.Router()
const Auth = require('../middleware/Authenthication.js')
const {createTicket , getAllPurchases , comfirmPayment , getUserPurchases , getUncomfirmedPurchases } = require('../controllers/ticketController.js')

router.post('/create-ticket' , Auth , createTicket)
router.get("/all", Auth , getAllPurchases);
router.get('/uncomfirmed' , Auth ,  getUncomfirmedPurchases)
router.get("/user", Auth ,  getUserPurchases);
router.patch('/comfirm' , Auth ,  comfirmPayment)



module.exports = router

