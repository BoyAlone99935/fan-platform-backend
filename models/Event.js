const mongoose = require("mongoose");

const ticketTypeSchema =
    new mongoose.Schema({

        name: {

            type: String,

            required: true

        },

        price: {

            type: Number,

            required: true

        },

        section : {
            type : String,
            default : ""
        }, 
         
        rows: [{
          type: String
        }],

        seatsPerRow: {
            type: Number,
            required: true
        },

        cartegory: {
            type: String,
            enum: ["vip", "Regular"],
            required: true
        },

        ticketType : {
            enum : [ "Reserved" , "General Admission"],
            type : String,
            required : true
        },


        image : {
            type : String,
            default : ""
        },

        


    });


const eventSchema =
    new mongoose.Schema(

        {
          
            celebrity: {

                type:
                    mongoose.Schema.Types.ObjectId,

                ref: "Celebrity",

                required: true

            },

            title: {

                type: String,

                required: true,

                trim: true

            },

            description: {

                type: String,

                default: ""

            },

            venue: {

                type: String,

                required: true

            },

            location: {
                name: {
                    type: String,
                    required: true
                },
                address: {
                    type: String,
                    default: ""
                },
                city: {
                    type: String,
                    required: true
                },
                country: {
                    type: String,
                    required: true
                }
            },

            eventDate: {

                type: Date,

                required: true

            },

            bannerImage: {

                type: String,

                default: ""

            },
            arenaOverview : {
            type : String,
            default : ""
        },

            ticketTypes: [

                ticketTypeSchema

            ],

            isSoldOut: {

                type: Boolean,

                default: false

            }

        },

        {
            timestamps: true
        }

    );

module.exports =
    mongoose.model(
        "Event",
        eventSchema
    );