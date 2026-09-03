const express = require('express')
const router = express.Router()
const Auth = require('../middleware/Authenthication.js')
const {createTicket , getAllPurchases , confirmPayment , getUserPurchases , getUnconfirmedPurchases , getTicketByPurchaseId } = require('../controllers/ticketController.js')

router.post('/create-ticket' , Auth , createTicket)
router.get("/all", Auth , getAllPurchases);
router.get('/unconfirmed' , Auth ,  getUnconfirmedPurchases)
router.get("/user", Auth ,  getUserPurchases);
router.patch('/confirm' , Auth ,  confirmPayment)
router.get("/ticket/:purchaseId", Auth, getTicketByPurchaseId);


module.exports = router

