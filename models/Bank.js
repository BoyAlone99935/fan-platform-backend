const mongoose = require("mongoose");

const bankPaymentSchema = new mongoose.Schema({

    provider: {
        type: String,
        required: true
    },

    type: {
    type: String,
    enum: [
        "bank",
        "money_transfer",
        "digital_wallet"
    ],
    default: "bank"
},

    accountName: {
        type: String,
        required: true
    },

    bankName: {
        type: String
    },

    accountNumber: {
        type: String
    },

    routingNumber: {
        type: String
    },

    swiftCode: {
        type: String
    },

    iban: {
        type: String
    },

    sortCode: {
        type: String
    },

    email: {
        type: String
    },

    phoneNumber: {
        type: String
    },

    country: {
        type: String,
        required: true
    },

    instructions: {
        type: String
    },

    currency : {
        type : String
    },

    active: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model(
    "BankPayment",
    bankPaymentSchema
);