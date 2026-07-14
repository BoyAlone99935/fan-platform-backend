const mongoose = require("mongoose");

const meetAndGreetSchema = new mongoose.Schema({

    celebrity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Celebrity",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    name: {
        type: String,
        enum: ["regular", "vip"],
        required: true
    }, 

    description: {
        type: String,
        default: ""
    },

    price: {
        type: Number,
        required: true
    },

    capacity: {
        type: Number,
        required: true
    },

    bookedCount: {
        type: Number,
        default: 0
    },

    date: {
        type: Date,
        required: true
    },

    duration: {
        type: String,
        default: "30 mins"
    },

    location: {
        name: {
            type: String,
            
        },
        address: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            required : true
        },
        country: {
            type: String,
            required : true
        }
    },

    images: [
        {
            type: String
        }
    ],

    perks: [
        {
            type: String
        }
    ],

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

module.exports =
    mongoose.model("MeetAndGreet", meetAndGreetSchema);

