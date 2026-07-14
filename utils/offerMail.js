const { Resend } = require("resend");
require('dotenv').config()
const resend = new Resend(process.env.RESEND_API_KEY);
const sendOfferMail = async (user) => {

    try {

        console.log("Sending email to:", user.email);

        const response = await resend.emails.send({

            from: "Spotlight <onboarding@resend.dev>",

            to: user.email,

            subject: "Your Meet & Greet Offer Is Ready",

            html: `
    <h2>Hello ${user.username},</h2>

    <p>
        We are pleased to inform you that your Meet & Greet request has been reviewed by the relevant parties and management team.
    </p>

    <p>
        After careful consideration, an offer has been prepared for you and is now available on your account.
    </p>

    <p>
        Please log in to your dashboard to review the offer details, including the proposed arrangements, location, and pricing.
    </p>

    <p>
        <strong>Important:</strong> This offer is valid for 24 hours from the time it was issued.
    </p>

    <p>
        If the offer is not accepted or rejected within this period, it will automatically expire and become invalid.
    </p>

    <p>
        We encourage you to review the offer as soon as possible to avoid missing the opportunity.
    </p>

    <p>
        Thank you for using Spotlight.
    </p>

    <br />

    <p>
        Best regards,<br />
        Spotlight Team
    </p>
`
    
        });

        console.log("Resend response:", response);

    } catch (error) {

        console.log("EMAIL ERROR:", error);

    }
};



module.exports = sendOfferMail;  


