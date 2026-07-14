const passport = require("passport");
const sendWelcomeEmail = require('../utils/sendEmail')
const GoogleStrategy =
    require("passport-google-oauth20").Strategy;

const User = require("../models/User");

passport.use(

    new GoogleStrategy(

        {
            clientID:
                process.env.CLIENT_ID,

            clientSecret:
                process.env.CLIENT_SECRET,

            callbackURL:
                "/api/auth/google/callback"
        },

        async (
            accessToken,
            refreshToken,
            profile,
            done
        ) => {

            try {

                // Check if user exists
                let user = await User.findOne({
                    googleId: profile.id
                });

                // Create user if not found
                if (!user) {

                    user = await User.create({
                        username: profile.displayName,

                        email:
                            profile.emails[0].value,

                        googleId: profile.id
                    });


                    await sendWelcomeEmail(user)

                }

                done(null, user);

            } catch (error) {

                done(error, null);

            }

        }

    )

);