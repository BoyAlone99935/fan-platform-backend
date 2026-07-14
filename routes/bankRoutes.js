const express = require("express");
const router = express.Router();

const auth = require("../middleware/Authenthication");
const upload = require("../middleware/Upload");

const {
    createPaymentMethod,
    getPaymentMethods,
    getPaymentMethod,
    deletePaymentMethod,
    updatePaymentMethod
} = require('../controllers/bankController');


router.post(
    "/create",
    auth,
    upload.single("logo"),
    createPaymentMethod
);

router.get(
    "/",
    auth,
    getPaymentMethods
);

router.get(
    "/:id",
    auth,
    getPaymentMethod
);

router.delete(
    "/:id",
    auth,
    deletePaymentMethod
);

router.patch(
    "/:id",
    auth,
    upload.single("logo"),
    updatePaymentMethod
);

module.exports = router;