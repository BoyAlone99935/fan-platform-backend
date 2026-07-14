const express = require('express');
const router = express.Router();
const auth = require('../middleware/Authenthication')
const {
    createOffer,
    createRequest,
    rejectOffer,
    acceptOffer,
    getRequest,
    getAllRequests,
    updatePaymentStatus,
    getPendingPayments,
    getCompletedMeetPurchases
} = require('../controllers/RequestController');
const upload = require('../middleware/Upload.js')


router.post('/create-request', auth , createRequest);
router.get('/getAllRequests' , auth , getAllRequests)
router.get('/pending-payments' , auth , getPendingPayments)
router.get(
    "/completed-payments",
    auth,
    getCompletedMeetPurchases
);

router.post('/create-offer/:id', auth , upload.single('image'), createOffer);

router.patch('/accept-offer/:id' , auth , acceptOffer)
router.patch('/update-payment/:id' , auth , updatePaymentStatus)
router.get('/getRequest' , auth , getRequest)
router.patch('/reject-offer/:id' , auth , rejectOffer)

module.exports = router;