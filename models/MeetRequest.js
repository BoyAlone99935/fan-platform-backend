const mongoose = require("mongoose");

const meetAndGreetRequestSchema = new mongoose.Schema({

    // 👤 USER WHO MADE REQUEST
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // 🎤 CELEBRITY REQUESTED
    celebrity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Celebrity",
        required: true
    },

    // 📝 USER MESSAGE / IDEA
    message: {
        type: String,
        default: ""
    },

    // 📍 USER ONLY PROVIDES CITY + COUNTRY
    preferredLocation: {

        city: {
            type: String,
            required: true
        },

        country: {
            type: String,
            required: true
        }

    },

    // 📅 OPTIONAL USER DATE PREFERENCE
    preferredDate: {
        type: Date,
        default: null
    },

    // 🔄 REQUEST STATUS FLOW
    status: {
        type: String,
        enum: [
            "pending",
            "offered",
            "accepted",
            "rejected",
            "expired"
        ],
        default: "pending"
    },

    // 💼 ADMIN OFFER (FULL CONTROL)
    offer: {

        price: {
            type: Number
        },

        message: {
            type: String
        },

        date: {
            type: Date
        },

        // 📍 FINAL LOCATION DECIDED BY ADMIN
        location: {

            name: String,
            address: String,
            city: String,
            country: String,

            // 🖼 ONLY ADMIN CAN ADD IMAGE
            image: String
        },


        // ⏳ OFFER EXPIRY TIME
        expiresAt: {
            type: Date
        },

        offerViewed: {
            type: Boolean,
            default: false
        },

        offerViewedAt: {
            type: Date
        }
    },

    // 💰 FINAL AGREED PRICE AFTER ACCEPTANCE
    finalPrice: {
        type: Number,
        default: null
    },

    // 💳 PAYMENT STATUS
    isPaid: {
        type: Boolean,
        default: false
    },

    // 📊 FINAL TIMESTAMPS
    acceptedAt: Date,
    rejectedAt: Date

}, {
    timestamps: true
});

module.exports =
    mongoose.model("MeetAndGreetRequest", meetAndGreetRequestSchema);