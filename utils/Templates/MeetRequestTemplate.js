const meetBookingTemplate = ({ user, request }) => {

    return `
<!DOCTYPE html>
<html>

<head>
    <title>Meet & Greet Booking Confirmation</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">

<div style="max-width:700px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;">

    <!-- HEADER -->
    <div style="background:#111827;padding:35px;text-align:center;color:#ffffff;">

        <h1 style="margin:0;font-size:30px;">
            Spotlight
        </h1>

        <p style="margin-top:10px;font-size:16px;">
            Your Meet & Greet Booking is Confirmed
        </p>

    </div>

    <!-- BODY -->
    <div style="padding:35px;">

        <p>
            Hello <strong>${user.username || user.firstName || "Fan"}</strong>,
        </p>

        <p>
            Thank you for completing your Meet & Greet booking.
            Your reservation has been successfully confirmed and your payment has been received.
        </p>

        <p>
            We're excited to help make this a memorable experience.
        </p>

        <!-- BOOKING DETAILS -->

        <div style="background:#f9fafb;border-left:5px solid #111827;padding:20px;margin:30px 0;">

            <h3 style="margin-top:0;">
                Booking Details
            </h3>

            <p>
                <strong>Booking Reference:</strong>
                ${request._id}
            </p>

            <p>
                <strong>Celebrity:</strong>
                ${request.celebrity?.name || ""}
            </p>

            <p>
                <strong>Date:</strong>
                ${new Date(request.offer.date).toLocaleString()}
            </p>

            <p>
                <strong>Venue:</strong>
                ${request.offer.location.name}
            </p>

            <p>
                <strong>Address:</strong>
                ${request.offer.location.address}
            </p>

            <p>
                <strong>City:</strong>
                ${request.offer.location.city}
            </p>

            <p>
                <strong>Country:</strong>
                ${request.offer.location.country}
            </p>

            <p>
                <strong>Amount Paid:</strong>
                $${request.offer.price}
            </p>

            <p>
                <strong>Payment Status:</strong>
                Paid
            </p>

        </div>

        <!-- NEXT STEPS -->

        <div style="background:#eef6ff;border-radius:10px;padding:20px;">

            <h3 style="margin-top:0;">
                What Happens Next?
            </h3>

            <p>
                Our team will continue coordinating your Meet & Greet experience.
            </p>

            <p>
                As your scheduled date approaches, you'll receive additional emails containing important information such as:
            </p>

            <ul>

                <li>Arrival instructions</li>

                <li>Check-in procedures</li>

                <li>Venue access information</li>

                <li>Security requirements</li>

                <li>Schedule updates (if applicable)</li>

            </ul>

        </div>

        <!-- IMPORTANT -->

        <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:20px;margin-top:25px;">

            <h3 style="margin-top:0;">
                Important Information
            </h3>

            <ul>

                <li>Please arrive at least <strong>20 minutes early.</strong></li>

                <li>Bring a valid government-issued photo ID.</li>

                <li>Your booking is personal and non-transferable.</li>

                <li>Keep an eye on your inbox for future updates.</li>

            </ul>

        </div>

        <!-- PRIVACY -->

        <div style="background:#ecfeff;border:1px solid #a5f3fc;border-radius:10px;padding:20px;margin-top:25px;">

            <h3 style="margin-top:0;">
                Privacy & Security
            </h3>

            <p>

                For privacy and security reasons, we do not disclose the celebrity's travel arrangements,
                accommodation, or personal logistics.

            </p>

            <p>

                Any information shared with you will only include what is necessary to ensure a smooth,
                safe, and enjoyable Meet & Greet experience.

            </p>

        </div>

        <!-- FOOTER MESSAGE -->

        <p style="margin-top:35px;">

            We appreciate your trust in Spotlight and can't wait to deliver an unforgettable experience.

        </p>

        <p>

            Thank you for choosing <strong>Spotlight.</strong>

        </p>

    </div>

    <!-- FOOTER -->

    <div style="background:#111827;color:white;text-align:center;padding:18px;font-size:13px;">

        © ${new Date().getFullYear()} Spotlight. All Rights Reserved.

    </div>

</div>

</body>

</html>
    `;

};

module.exports = meetBookingTemplate; 