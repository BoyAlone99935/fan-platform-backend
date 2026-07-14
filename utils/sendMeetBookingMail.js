const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const meetBookingTemplate = require("./Templates/MeetRequestTemplate");

const sendMeetBookingMail = async (user, request) => {
    console.log(user)

    const html = meetBookingTemplate({
        user,
        request
    });

    try {

        const response = await resend.emails.send({

            from: "Spotlight <onboarding@resend.dev>",

            to: user.email,

            subject: "Your Meet & Greet Booking is Confirmed ✨",

            html

        });

        console.log("Meet booking email:", response);

    } catch (error) {

        console.log("EMAIL ERROR:", error);

    }

};

module.exports = sendMeetBookingMail;