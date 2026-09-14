const { Resend } = require("resend");
require("dotenv").config();
const resend = new Resend(process.env.RESEND_API_KEY);

// ---------------------------------------------------------------------------
// Brand tokens, pulled from your logo's gradient (#4c1d95 -> #4338ca -> #2563eb)
// ---------------------------------------------------------------------------
const THEME = {
    bg: "#ffffff",
    bgAlt: "#f7f6fb",
    text: "#15131f",
    textMuted: "#6c6a7c",
    border: "#ece9f4",
    indigo: "#4338ca",
    gradientCss: "linear-gradient(135deg,#4c1d95 0%,#4338ca 50%,#2563eb 100%)",
    gradientFallback: "#4338ca", // Outlook ignores the CSS gradient — needs a real color behind it
};

const FONT_STACK = "Helvetica, Arial, sans-serif";

// IMPORTANT: <svg> and @import'd Google Fonts are stripped by Outlook and a
// lot of webmail clients — an inline SVG logo will render as a blank gap for
// a meaningful slice of recipients. Export your logo as a PNG (2x size for
// retina, e.g. 380x114 -> 760x228) and host it, then point this at that URL.
const LOGO_URL = "https://YOUR-CDN-OR-SITE.com/headliner-logo.png";

const FEATURES = [
    "Discover celebrity events",
    "Book tickets for live experiences",
    "Stay updated with announcements",
    "Connect with exclusive fan moments",
];

const sendWelcomeEmail = async (user) => {
    try {
        console.log("Sending email to:", user.email);

        const response = await resend.emails.send({
            from: "Headliner <tickets@regentfeild.com>",
            to: user.email,
            subject: "Welcome to Headliner 🎉",
            html: `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="color-scheme" content="light" />
    <title>Welcome to Headliner</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <style>
        table, td { border-collapse: collapse; }
        * { font-family: Arial, sans-serif !important; }
    </style>
    <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${THEME.bgAlt};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
        You're in — welcome to Headliner. Your backstage pass starts now.
        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${THEME.bgAlt};">
        <tr>
            <td align="center" style="padding:40px 16px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

                    <!-- logo -->
                    <tr>
                        <td align="center" style="padding:0 0 32px;">
                            <img
                                src="${LOGO_URL}"
                                width="152"
                                alt="Headliner — Event Booking"
                                style="display:block;border:0;width:152px;height:auto;"
                            />
                        </td>
                    </tr>

                    <!-- card -->
                    <tr>
                        <td style="background:${THEME.bg};border:1px solid ${THEME.border};border-radius:14px;overflow:hidden;">

                            <!-- hairline accent -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td height="3" style="line-height:3px;font-size:0;background-color:${THEME.gradientFallback};background-image:${THEME.gradientCss};">&nbsp;</td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:44px 44px 8px;text-align:center;">
                                        <p style="margin:0 0 14px;font-family:${FONT_STACK};font-size:22px;line-height:1;">
                                            
                                        </p>
                                        <h1 style="margin:0 0 6px;font-family:${FONT_STACK};font-size:26px;font-weight:bold;color:${THEME.text};">
                                            Welcome to Headliner
                                        </h1>
                                        <p style="margin:0;font-family:${FONT_STACK};font-size:14px;color:${THEME.textMuted};">
                                            Your backstage pass starts now.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:24px 44px 8px;font-family:${FONT_STACK};font-size:15px;line-height:1.7;color:${THEME.text};">
                                        <p style="margin:0 0 16px;">Hi ${user.username},</p>
                                        <p style="margin:0 0 16px;">
                                            We're excited to welcome you to <strong>Headliner</strong> — a place
                                            where fans connect with their favourite celebrities, explore
                                            exclusive events, and stay closer to the moments that matter.
                                        </p>
                                        <p style="margin:0;">
                                            Think of Headliner as your backstage pass to experiences you
                                            normally wouldn't have access to.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- feature list -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:20px 44px 8px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${THEME.bgAlt};border-radius:10px;">
                                            <tr>
                                                <td style="padding:22px 24px;">
                                                    <p style="margin:0 0 14px;font-family:${FONT_STACK};font-size:11px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:${THEME.indigo};">
                                                        What you can do on Headliner
                                                    </p>
                                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                                        ${FEATURES.map(
                                                            (feature, i) => `
                                                        <tr>
                                                            <td style="padding:${i === 0 ? "0" : "10px"} 0 0;font-family:${FONT_STACK};font-size:14px;color:${THEME.text};">
                                                                <span style="color:${THEME.indigo};font-weight:bold;">✦</span>&nbsp; ${feature}
                                                            </td>
                                                        </tr>`
                                                        ).join("")}
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:28px 44px 40px;text-align:center;font-family:${FONT_STACK};">
                                        <p style="margin:0 0 4px;font-size:15px;color:${THEME.text};">
                                            We're building something special here, and you're part of it
                                            from day one.
                                        </p>
                                        <p style="margin:0 0 22px;font-size:15px;font-weight:bold;color:${THEME.text};">
                                            Let's make it unforgettable. ✨
                                        </p>
                                        <p style="margin:0;font-size:13px;color:${THEME.textMuted};">
                                            — The Headliner Team
                                        </p>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <!-- footer -->
                    <tr>
                        <td align="center" style="padding:28px 16px 0;">
                            <p style="margin:0;font-family:${FONT_STACK};font-size:12px;letter-spacing:0.04em;color:${THEME.textMuted};">
                                Headliner &middot; Event Booking
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
        });

        console.log("Resend response:", response);
    } catch (error) {
        console.log("EMAIL ERROR:", error);
    }
};

module.exports = sendWelcomeEmail;



