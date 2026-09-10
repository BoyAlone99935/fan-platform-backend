const express = require('express')
const router = express.Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/Authenthication')

require('dotenv').config()
const {
    register,
    login,
    logout
} = require('../controllers/authController')

const {getCurrentUser} = require('../controllers/user')

router.get('/user' , auth , getCurrentUser)

router.post('/register' , register)

router.post("/login", login);

router.post("/logout", logout);

/*router.get('/google' , 
    passport.authenticate("google",{
      scope : ["profile" , "email"]
    })
)*/

router.get('/google', (req, res, next) => {
    const redirect = req.query.redirect || "/";

    passport.authenticate("google", {
        scope: ["profile", "email"],
        state: redirect
    })(req, res, next);
});

/*router.get('/google/callback' , 
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


        res.redirect("http://localhost:5173/user-frontend/")

    }

   
)*/



router.get('/google/callback',
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/login"
    }),

    async (req, res) => {

        const token = jwt.sign(
            { userId: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const redirect = req.query.state || "/";

        res.redirect(
            `http://localhost:5173/user-frontend${redirect}`
        );
    }
);



module.exports = router;