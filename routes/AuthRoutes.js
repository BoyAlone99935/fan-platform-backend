const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')

require('dotenv').config()
const {
    register,
    login,
    logout
} = require('../controllers/authController')


router.post('/register' , register)

router.post("/login", login);

router.post("/logout", logout);

router.get('/google' , 
    passport.authenticate("google",{
      scope : ["profile" , "email"]
    })
)

router.get('/google/callback' , 
    passport.authenticate("google" , {
        session: false,
        failureRedirect : "/login"
    }),

    async (req , res) => {

       const token = jwt.sign(
          { userId: req.user._id },
          process.env.JWT_SECRET,
          {expiresIn : "7d"}
        )
       

        res.cookie("token" , token , {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })


        res.redirect("http://127.0.0.1:5500")

    }

   
)

module.exports = router;