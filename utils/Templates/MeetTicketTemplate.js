const meetAndGreetTicketTemplate = ({ user, tickets, purchaseId }) => {

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Meet & Greet Confirmation</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

<div style="max-width:700px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;">

    <!-- HEADER -->
    <div style="background:#111827;padding:35px;text-align:center;color:white;">

        <h1 style="margin:0;">Elite Fans</h1>

        <p style="margin-top:10px;font-size:16px;">
            Your Meet & Greet Has Been Confirmed
        </p>

    </div>

    <div style="padding:35px;">

        <p>Hello <strong>${user.username || user.firstName || "Fan"}</strong>,</p>

        <p>Congratulations!</p>

        <p>
            Your private Meet & Greet booking has been confirmed.
            This email serves as your official entry pass.
        </p>

        <p>
            <strong>Purchase ID:</strong> ${purchaseId}
        </p>

        <hr/>

        ${tickets.map(ticket => `

            <div style="border:1px solid #e5e7eb;border-radius:10px;padding:20px;margin-bottom:25px;">

                <h3>Meet & Greet Pass</h3>

                <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>

                <p><strong>Celebrity:</strong> ${ticket.celebrity?.name || ""}</p>

                <p><strong>Date:</strong> ${new Date(ticket.date).toLocaleString()}</p>

                <p><strong>Venue:</strong> ${ticket.location?.name || ""}</p>

                <p><strong>Address:</strong> ${ticket.location?.address || ""}</p>

                <p><strong>City:</strong> ${ticket.location?.city || ""}</p>

                <p><strong>Country:</strong> ${ticket.location?.country || ""}</p>

                <div style="text-align:center;margin-top:20px;">
                    <img src="${ticket.qrCode}" width="180"/>
                    <p style="font-size:12px;color:#666;">
                        Present this QR code at check-in
                    </p>
                </div>

            </div>

        `).join("")}

        <!-- BEFORE YOU ARRIVE -->
        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:20px;margin-top:30px;">

            <h3>Before You Arrive</h3>

            <ul>
                <li>Arrive at least <strong>20 minutes early</strong></li>
                <li>Bring a valid photo ID</li>
                <li>QR code is single-use and non-transferable</li>
                <li>Have this email ready on your phone</li>
            </ul>

        </div>

        <!-- IMPORTANT NOTICE -->
        <div style="background:#eef6ff;border-radius:10px;padding:20px;margin-top:25px;">

            <h3>Important Notice</h3>

            <p>
                This ticket is personal and cannot be transferred or resold.
                Misuse of QR codes may result in cancellation.
            </p>

        </div>

        <!-- STAY UPDATED -->
        <div style="background:#ecfeff;border:1px solid #a5f3fc;border-radius:10px;padding:20px;margin-top:25px;">

            <h3>Stay Updated</h3>

            <p>
                We will use this email to communicate important updates regarding your Meet & Greet experience.
            </p>

            <p>
                As the date approaches, you may receive updates such as check-in instructions, arrival windows,
                venue access details, and schedule adjustments if necessary.
            </p>

            <p>
                For privacy reasons, celebrity travel and personal logistics are not disclosed.
                Only essential event information will be shared.
            </p>

        </div>

        <p style="margin-top:35px;">
            We look forward to giving you an unforgettable experience.
        </p>

        <p>
            Thank you for choosing <strong>Elite Fans</strong>.
        </p>

    </div>

    <div style="background:#111827;color:white;text-align:center;padding:18px;font-size:13px;">

        © ${new Date().getFullYear()} Elite Fans. All rights reserved.

    </div>

</div>

</body>
</html>
    `;
};

module.exports = meetAndGreetTicketTemplate;