const eventTicketTemplate = ({ user, tickets, purchaseId }) => {
   console.log(tickets)
   console.log(tickets?.[0].qrCode)
    return `
    <div style="font-family:Arial,sans-serif;max-width:700px;margin:auto;padding:20px;background:#ffffff;">

        <h1 style="color:#111827;">
            Spotlight
        </h1>

        <p>Hi ${user.username || user.firstName || "Fan"},</p>

        <p>
            Your ticket purchase was successful.
            Below are your event ticket(s).
        </p>

        <p>
            <strong>Purchase ID:</strong> ${purchaseId}
        </p>

        <hr/>

        ${tickets.map(ticket => `

            <div style="border:1px solid #ddd;padding:20px;margin-bottom:25px;border-radius:10px;">

                <h2>${ticket.event?.title || "Event Ticket"}</h2>

                <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>

                <p><strong>Category:</strong> ${ticket.category}</p>

                <p><strong>Date:</strong> ${new Date(ticket.date).toLocaleString()}</p>

                <p><strong>Venue:</strong> ${ticket.location.name}</p>

                <p><strong>City:</strong> ${ticket.location.city}</p>

                <p><strong>Country:</strong> ${ticket.location.country}</p>

                <p>
                    <strong>Seat:</strong>
                    ${ticket.seat?.section || "-"}
                    ${ticket.seat?.row || ""}
                    ${ticket.seat?.number || ""}
                </p>

                <div style="margin-top:20px;">
                    <img
                        src="${ticket.qrCodeUrl}"
                        alt="QR Code"
                        width="180"
                    />
                </div>

            </div>

        `).join("")}

        <hr/>

        <p>
            Please arrive at least
            <strong>30 minutes before</strong>
            the event begins.
        </p>

        <p>
            Present your QR code at the entrance for admission.
        </p>

    </div>
    `;
};

module.exports = eventTicketTemplate;