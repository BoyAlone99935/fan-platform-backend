const { Resend } = require("resend");
require('dotenv').config()
const resend = new Resend(process.env.RESEND_API_KEY);
const sendWelcomeEmail = async (user) => {

    try {

        console.log("Sending email to:", user.email);

        const response = await resend.emails.send({

            from: "Spotlight <onboarding@resend.dev>",

            to: user.email,

            subject: "Welcome to Spotlight",

            html: `
<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">

    <h1 style="color: #111;">
        Welcome to Spotlight 👋
    </h1>

    <p>
        Hi ${user.username},
    </p>

    <p>
        We’re excited to welcome you to <strong>Spotlight</strong> a place where fans connect with their favourite celebrities,
        explore exclusive events, and stay closer to the moments that matter.
    </p>

    <p>
        Think of Spotlight as your backstage pass to experiences you normally wouldn’t have access to.
    </p>

    <hr />

    <h3> What you can do on Spotlight:</h3>

    <ul>
        <li>Discover celebrity events</li>
        <li>Book tickets for live experiences</li>
        <li>Stay updated with announcements</li>
        <li>Connect with exclusive fan moments</li>
    </ul>

    <p>
        We’re building something special here, and you’re part of it from day one.
    </p>

    <p>
        Let’s make it unforgettable 
    </p>

    <p>
         The Spotlight Team
    </p>

</div>
`
        });

        console.log("Resend response:", response);

    } catch (error) {

        console.log("EMAIL ERROR:", error);

    }
};



module.exports = sendWelcomeEmail;  



