const mongoose = require('mongoose')

const celebritySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },


    slug : {
        type : String,
        required : true,
        trim : true
    },


    profileImage : {
        type : String,
        default : ""
    },


    coverImage : {
        type : String,
        default : ""
    },

    bio : {
        type : String,
        default : ""
    },

    category : {
        type : String,
        default : ""
    },


    socialLinks: {

        instagram: {
            type: String,
            default: ""
        },

        twitter: {
            type: String,
            default: ""
        },

        youtube: {
            type: String,
            default: ""
        }

    }
})


module.exports = mongoose.model("Celebrity" , celebritySchema)