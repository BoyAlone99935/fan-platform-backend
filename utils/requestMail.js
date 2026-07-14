const { Resend } = require("resend");
require('dotenv').config()
const resend = new Resend(process.env.RESEND_API_KEY);
const sendRequestMail = async (user) => {

    try {

        console.log("Sending email to:", user.email);

        const response = await resend.emails.send({

            from: "Spotlight <onboarding@resend.dev>",

            to: user.email,

            subject: "Your Request Has Been Submitted for Review",

            html:  `
        <h2>Request Submitted Successfully</h2>

        <p>
            Thank you for submitting your Meet & Greet request.
        </p>

        <p>
            Your request has been forwarded to the celebrity's management team for review.
        </p>

        <p>
            The management team will evaluate the feasibility of the request, including scheduling, availability, location, and other logistical considerations.
        </p>

        <p>
            If the request is considered feasible, we will send you a personalized offer containing the proposed details, pricing, and meeting arrangements.
        </p>

        <p>
            Please note that the review process may take several days depending on the celebrity's schedule and management response time.
        </p>

        <p>
            You will receive an email notification as soon as there is an update regarding your request.
        </p>

        <p>
            Thank you for your patience and for using our platform.
        </p>
    `
        });

        console.log("Resend response:", response);

    } catch (error) {

        console.log("EMAIL ERROR:", error);

    }
};



module.exports = sendRequestMail;  


