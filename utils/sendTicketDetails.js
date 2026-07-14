const { Resend } = require("resend");
require("dotenv").config();

const resend = new Resend(process.env.RESEND_API_KEY);

const eventTicketTemplate = require("../utils/Templates/EventTicketTemplate");
const meetTicketTemplate = require("../utils/Templates/MeetTicketTemplate");

const sendTicketDetails = async (user, tickets, purchaseId) => {
    
    // Add a QR code URL to every ticket
    console.log(user)
  

    const ticketsWithQr = tickets.map(ticket => ({
        ...ticket.toObject(),
        qrCodeUrl: `${process.env.BASE_URL}/qr/${ticket.ticketNumber}`
    }));



    const ticketType = tickets?.[0].bookingType
    

    let subject;
    let html;

    if (ticketType === "event") {

        html = eventTicketTemplate({
            user,
            tickets: ticketsWithQr,
            purchaseId
        });

        subject = `Your Ticket for ${ticketsWithQr?.[0]?.title || "event"} is Confirmed 🎟️`;

    } else if (ticketType === "meet_and_greet") {

        html = meetTicketTemplate({
            user,
            tickets: ticketsWithQr,
            purchaseId
        });

        subject = `Your Meet & Greet Experience is Confirmed ✨`;

    }

    try {

        

        const response = await resend.emails.send({
            from: "Spotlight <onboarding@resend.dev>",
            to: user.email,
            subject,
            html
        });

        console.log("Resend response:", response);

    } catch (error) {

        console.log("EMAIL ERROR:", error);

    }
};

module.exports = sendTicketDetails;