/**
 * Elite Fans — Meet & Greet Confirmation Email
 * -------------------------------------------------------------------------
 * Same restrained system as the event ticket template: table layout, inline
 * styles, one typeface, one accent used only as small text. "Premium" here
 * comes from hierarchy and whitespace, not from more color — so the three
 * pastel info boxes (orange/blue/cyan) from the original are gone in favor
 * of plain sections separated by hairlines, the way a hotel or airline
 * confirmation email is actually built.
 */

const THEME = {
    bg: "#ffffff",
    bgAlt: "#f7f6fb",
    text: "#15131f",
    textMuted: "#6c6a7c",
    border: "#e5e4e8",
    ink: "#15131f",      // header background — near-black, not a brand color
    accent: "#4338ca",   // used only for small labels
};

const FONT_STACK = "Helvetica, Arial, sans-serif";

const formatEventDate = (date) => {
    const d = new Date(date);
    const datePart = d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const timePart = d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
    return { datePart, timePart };
};

// A section with a small caps label + a hairline top rule — replaces the
// old colored callout boxes.
const noteSection = (label, bodyHtml) => `
    <tr>
        <td style="padding:20px 32px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="border-top:1px solid ${THEME.border};padding-top:20px;">
                        <p style="margin:0 0 10px;font-family:${FONT_STACK};font-size:11px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:${THEME.accent};">
                            ${label}
                        </p>
                        ${bodyHtml}
                    </td>
                </tr>
            </table>
        </td>
    </tr>
`;

const perforation = () => `
    <tr>
        <td style="padding:0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td width="14" style="padding:0;">
                        <div style="width:14px;height:14px;border-radius:50%;background:${THEME.bgAlt};border:1px solid ${THEME.border};margin-left:-7px;"></div>
                    </td>
                    <td style="border-top:1px dashed ${THEME.border};font-size:0;line-height:0;">&nbsp;</td>
                    <td width="14" style="padding:0;">
                        <div style="width:14px;height:14px;border-radius:50%;background:${THEME.bgAlt};border:1px solid ${THEME.border};margin-right:-7px;"></div>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
`;

// ---------------------------------------------------------------------------
// One pass card
// ---------------------------------------------------------------------------
const passCard = (ticket, index, total) => {
    const { datePart, timePart } = formatEventDate(ticket.date);
    const addressLine = [ticket.location?.address, ticket.location?.city, ticket.location?.country]
        .filter(Boolean)
        .join(", ");

    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="margin:0 0 20px;background:${THEME.bg};border:1px solid ${THEME.border};border-radius:8px;overflow:hidden;">

        <!-- celebrity + pass label -->
        <tr>
            <td style="padding:24px 28px 4px;">
                ${
                    total > 1
                        ? `<p style="margin:0 0 6px;font-family:${FONT_STACK};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${THEME.textMuted};">Pass ${index + 1} of ${total}</p>`
                        : `<p style="margin:0 0 6px;font-family:${FONT_STACK};font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:${THEME.textMuted};">Meet &amp; Greet Pass</p>`
                }
                <h2 style="margin:0;font-family:${FONT_STACK};font-size:22px;line-height:1.3;font-weight:bold;color:${THEME.text};">
                    ${ticket.celebrity?.name || "Meet & Greet"}
                </h2>
            </td>
        </tr>

        <!-- date / venue / address -->
        <tr>
            <td style="padding:16px 28px 20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${THEME.border};margin-top:12px;padding-top:16px;">
                    <tr>
                        <td style="padding-top:16px;">
                            <p style="margin:0;font-family:${FONT_STACK};font-size:11px;letter-spacing:0.04em;text-transform:uppercase;color:${THEME.textMuted};">
                                Date &amp; time
                            </p>
                            <p style="margin:4px 0 14px;font-family:${FONT_STACK};font-size:14px;color:${THEME.text};">
                                ${datePart}, ${timePart}
                            </p>
                            <p style="margin:0;font-family:${FONT_STACK};font-size:11px;letter-spacing:0.04em;text-transform:uppercase;color:${THEME.textMuted};">
                                Venue
                            </p>
                            <p style="margin:4px 0 0;font-family:${FONT_STACK};font-size:14px;color:${THEME.text};">
                                ${ticket.location?.name || "-"}
                            </p>
                            ${
                                addressLine
                                    ? `<p style="margin:2px 0 0;font-family:${FONT_STACK};font-size:13px;color:${THEME.textMuted};">${addressLine}</p>`
                                    : ""
                            }
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        ${perforation()}

        <!-- QR stub -->
        <tr>
            <td style="padding:22px 28px;background:${THEME.bgAlt};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td valign="middle">
                            <p style="margin:0;font-family:${FONT_STACK};font-size:11px;letter-spacing:0.04em;text-transform:uppercase;color:${THEME.textMuted};">
                                Ticket number
                            </p>
                            <p style="margin:4px 0 12px;font-family:${FONT_STACK};font-size:14px;font-weight:bold;color:${THEME.text};">
                                ${ticket.ticketNumber}
                            </p>
                            <p style="margin:0;font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:${THEME.textMuted};">
                                Present this QR code at check-in.
                            </p>
                        </td>
                        <td width="100" align="right" valign="middle">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background:${THEME.bg};border:1px solid ${THEME.border};border-radius:6px;">
                                <tr>
                                    <td style="padding:8px;">
                                        <img src="${ticket.qrCode}" width="84" height="84" alt="QR code for ticket ${ticket.ticketNumber}" style="display:block;border:0;width:84px;height:84px;" />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    `;
};

// ---------------------------------------------------------------------------
// Full email
// ---------------------------------------------------------------------------
const meetAndGreetTicketTemplate = ({ user, tickets = [], purchaseId }) => {
    const greetingName = user?.username || user?.firstName || "there";
    const passWord = tickets.length === 1 ? "pass" : "passes";

    return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="color-scheme" content="light" />
    <title>Meet & Greet Confirmation</title>
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
        Your Meet &amp; Greet ${passWord} ${tickets.length > 1 ? "are" : "is"} confirmed — purchase ${purchaseId}.
        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${THEME.bgAlt};">
        <tr>
            <td align="center" style="padding:32px 16px;">
                <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:640px;max-width:640px;">

                    <!-- header: solid ink block, restrained -->
                    <tr>
                        <td style="padding:40px 32px;background:${THEME.ink};border-radius:8px 8px 0 0;text-align:center;">
                            <p style="margin:0 0 10px;font-family:${FONT_STACK};font-size:11px;font-weight:bold;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.55);">
                                Elite Fans
                            </p>
                            <p style="margin:0;font-family:${FONT_STACK};font-size:22px;font-weight:bold;color:#ffffff;">
                                Your Meet &amp; Greet is confirmed
                            </p>
                        </td>
                    </tr>

                    <!-- intro + purchase id -->
                    <tr>
                        <td style="padding:28px 32px;background:${THEME.bg};border:1px solid ${THEME.border};border-top:none;">
                            <p style="margin:0 0 14px;font-family:${FONT_STACK};font-size:14px;line-height:1.6;color:${THEME.text};">
                                Hello ${greetingName}, your private Meet &amp; Greet booking is confirmed. This email is your official entry ${passWord}.
                            </p>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${THEME.border};">
                                <tr>
                                    <td style="font-family:${FONT_STACK};font-size:12px;color:${THEME.textMuted};padding-top:16px;">
                                        Purchase ID
                                    </td>
                                    <td align="right" style="font-family:${FONT_STACK};font-size:12px;font-weight:bold;color:${THEME.text};padding-top:16px;">
                                        ${purchaseId}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- passes -->
                    <tr>
                        <td style="padding:24px 32px 4px;background:${THEME.bg};border-left:1px solid ${THEME.border};border-right:1px solid ${THEME.border};">
                            ${tickets.map((ticket, i) => passCard(ticket, i, tickets.length)).join("")}
                        </td>
                    </tr>

                    <!-- before you arrive -->
                    ${noteSection(
                        "Before you arrive",
                        `<ul style="margin:0;padding-left:18px;font-family:${FONT_STACK};font-size:13px;line-height:1.8;color:${THEME.text};">
                            <li>Arrive at least 20 minutes early</li>
                            <li>Bring a valid photo ID</li>
                            <li>Your QR code is single-use and non-transferable</li>
                            <li>Have this email ready on your phone</li>
                        </ul>`
                    )}

                    <!-- important notice -->
                    ${noteSection(
                        "Important notice",
                        `<p style="margin:0;font-family:${FONT_STACK};font-size:13px;line-height:1.6;color:${THEME.text};">
                            This pass is personal and cannot be transferred or resold. Misuse of QR codes may result in cancellation.
                        </p>`
                    )}

                    <!-- stay updated -->
                    ${noteSection(
                        "Stay updated",
                        `<p style="margin:0 0 10px;font-family:${FONT_STACK};font-size:13px;line-height:1.6;color:${THEME.text};">
                            We'll use this email for important updates about your Meet &amp; Greet — check-in instructions, arrival windows, venue access, and any schedule adjustments.
                        </p>
                        <p style="margin:0;font-family:${FONT_STACK};font-size:13px;line-height:1.6;color:${THEME.textMuted};">
                            For privacy, celebrity travel and personal logistics are never disclosed. Only essential event information is shared.
                        </p>`
                    )}

                    <!-- closing -->
                    <tr>
                        <td style="padding:24px 32px 28px;background:${THEME.bg};border-left:1px solid ${THEME.border};border-right:1px solid ${THEME.border};border-bottom:1px solid ${THEME.border};">
                            <p style="margin:0;font-family:${FONT_STACK};font-size:13px;line-height:1.6;color:${THEME.textMuted};">
                                We look forward to giving you an unforgettable experience. Thank you for choosing Elite Fans.
                            </p>
                        </td>
                    </tr>

                    <!-- footer -->
                    <tr>
                        <td style="padding:18px 32px;background:${THEME.ink};border-radius:0 0 8px 8px;text-align:center;">
                            <p style="margin:0;font-family:${FONT_STACK};font-size:12px;color:rgba(255,255,255,0.55);">
                                © ${new Date().getFullYear()} Elite Fans. All rights reserved.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
};

module.exports = meetAndGreetTicketTemplate;