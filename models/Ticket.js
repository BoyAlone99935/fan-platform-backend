const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({

    // =====================================================
    // 🔁 SHARED FIELDS (BOTH EVENT + MEET & GREET)
    // =====================================================

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    purchaseId : {
        type : String,
        required : true
    },

    email: {
        type: String,
        required: true,
        trim: true
    },

    celebrity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Celebrity"
    },

    bookingType: {
        type: String,
        enum: [
            "event",
            "meet_and_greet"
        ], 
        required: true
    },

    ticketNumber: {
        type: String,
        required: true,
        unique: true
    },

    paymentType: {
        type: String,
        enum: [
            "paystack",
            "usdt",
            "private"
        ],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "submitted",
            "paid",
            "failed",
            "refunded"
        ],
        default: "pending"
    },

    title : {
       type : String,
       required : true
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "USD"
    },

    paid: {
        type: Boolean,
        default: false
    },

    paidAt: {
        type: Date
    },

    date: {
        type: Date,
        required: true
    },

    location: {

        name: String,
        address: String,
        city: String,
        country: String,
        image: String,

        latitude: Number,
        longitude: Number
    },

    qrCode: {
        type: String
    },

    status: {
        type: String,
        enum: [
            "active",
            "used",
            "completed",
            "cancelled"
        ],
        default: "active"
    },

    checkedIn: {
        type: Boolean,
        default: false
    },

    checkedInAt: {
        type: Date
    },

    emailSent: {
        type: Boolean,
        default: false
    },

    emailSentAt: {
        type: Date
    },

    issuedAt: {
        type: Date,
        default: Date.now
    },

    // =====================================================
    // 🎟️ EVENT ONLY FIELDS
    // =====================================================

    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },

    category: {
        type: String,
    },

    quantity: {
        type: Number,
        default: 1
    },

    seat: {

        section: String,

        row: String,

        number: String,

        
    },

    seatType : {
        enum : [ "Reserved" , "General Admission"],
        type : String
    },

    

    // =====================================================
    // 🤝 MEET & GREET ONLY FIELDS
    // =====================================================

    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request"
    },

    message: {
        type: String
    },

    arrangedPayment : {
        default : false,
        type : Boolean
    },

   

}, {
    timestamps: true
});

module.exports =
    mongoose.model("Ticket", ticketSchema);