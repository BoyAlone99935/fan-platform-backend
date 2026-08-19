
/**
 * Spotlight — Event Ticket Email
 * -------------------------------------------------------------------------
 * Built as an EMAIL, not a webpage: table-based layout, inline styles only,
 * and a solid-color fallback behind every gradient (Outlook's Word engine
 * ignores CSS gradients entirely, so it needs a real bgcolor to fall back
 * to). Tested mentally against Outlook desktop, Gmail, Apple Mail, and
 * mobile clients — avoid flexbox/grid, avoid <style> dependency, avoid
 * position:absolute.
 */

// ---------------------------------------------------------------------------
// Brand tokens — resolved from your :root CSS variables. Email clients can't
// read CSS custom properties, so these are the literal values every inline
// style below pulls from. Change them here, they change everywhere.
// ---------------------------------------------------------------------------
const THEME = {
    bg: "#ffffff",
    bgAlt: "#f7f6fb",
    text: "#15131f",
    textMuted: "#6c6a7c",
    border: "#ece9f4",
    purple900: "#2b0f5e",
    purple700: "#4c1d95",
    indigo600: "#4338ca",
    blue600: "#2563eb",
    // Real <img>/CSS gradient for clients that support it
    gradientCss: "linear-gradient(135deg,#4c1d95 0%,#4338ca 50%,#2563eb 100%)",
    // Flat fallback for Outlook / older clients that drop the gradient
    gradientFallback: "#4338ca",
};




const FONT_STACK = "Arial, Helvetica, sans-serif";

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

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

const seatLabel = (seat) => {
    if (!seat || (!seat.section && !seat.row && !seat.number)) return null;
    return [
        seat.section ? `Sec ${seat.section}` : null,
        seat.row ? `Row ${seat.row}` : null,
        seat.number ? `Seat ${seat.number}` : null,
    ]
        .filter(Boolean)
        .join(" · ");
};

// A single "stat" cell used for Section / Row / Seat (or General Admission)
const statCell = (label, value) => `
    <td width="33%" align="center" style="padding:14px 6px;background:${THEME.bgAlt};border-radius:10px;">
        <p style="margin:0;font-family:${FONT_STACK};font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${THEME.textMuted};">
            ${label}
        </p>
        <p style="margin:4px 0 0;font-family:${FONT_STACK};font-size:16px;font-weight:700;color:${THEME.text};">
            ${value}
        </p>
    </td>
`;

// The perforated divider between the ticket's info half and its QR stub half
const perforation = () => `
    <tr>
        <td style="padding:0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td width="16" style="padding:0;">
                        <div style="width:16px;height:16px;border-radius:50%;background:${THEME.bgAlt};border:1px solid ${THEME.border};margin-left:-8px;"></div>
                    </td>
                    <td style="border-top:2px dashed ${THEME.border};font-size:0;line-height:0;">&nbsp;</td>
                    <td width="16" style="padding:0;">
                        <div style="width:16px;height:16px;border-radius:50%;background:${THEME.bgAlt};border:1px solid ${THEME.border};margin-right:-8px;"></div>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
`;

// ---------------------------------------------------------------------------
// One ticket "stub" card
// ---------------------------------------------------------------------------
const ticketCard = (ticket, index) => {
    const { datePart, timePart } = formatEventDate(ticket.date);
    const seat = seatLabel(ticket.seat);

    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="margin:0 0 24px;background:${THEME.bg};border:1px solid ${THEME.border};border-radius:16px;overflow:hidden;">

        <!-- accent bar -->
       

        <!-- header: event title + ticket index / category -->
        <tr>
            <td style="padding:24px 28px 4px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td valign="top">
                            <p style="margin:0 0 6px;font-family:${FONT_STACK};font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${THEME.indigo600};">
                                Ticket ${String(index + 1).padStart(2, "0")}
                            </p>
                            <h2 style="margin:0;font-family:${FONT_STACK};font-size:22px;line-height:1.25;font-weight:800;color:${THEME.text};">
                                ${ticket.event?.title || "Event Ticket"}
                            </h2>
                        </td>
                        <td valign="top" align="right" style="white-space:nowrap;">
                            <span style="display:inline-block;padding:6px 12px;border-radius:999px;background-color:${THEME.gradientFallback};background-image:${THEME.gradientCss};font-family:${FONT_STACK};font-size:11px;font-weight:700;letter-spacing:0.03em;color:#ffffff;">
                                ${(ticket.category || "General").toUpperCase()}
                            </span>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- date / venue -->
        <tr>
            <td style="padding:14px 28px 20px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td width="50%" valign="top" style="padding-right:10px;">
                            <p style="margin:0;font-family:${FONT_STACK};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${THEME.textMuted};">
                                Date &amp; time
                            </p>
                            <p style="margin:4px 0 0;font-family:${FONT_STACK};font-size:14px;font-weight:600;color:${THEME.text};">
                                ${datePart}
                            </p>
                            <p style="margin:1px 0 0;font-family:${FONT_STACK};font-size:14px;font-weight:600;color:${THEME.text};">
                                ${timePart}
                            </p>
                        </td>
                        <td width="50%" valign="top">
                            <p style="margin:0;font-family:${FONT_STACK};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${THEME.textMuted};">
                                Venue
                            </p>
                            <p style="margin:4px 0 0;font-family:${FONT_STACK};font-size:14px;font-weight:600;color:${THEME.text};">
                                ${ticket.location?.name || "-"}
                            </p>
                            <p style="margin:1px 0 0;font-family:${FONT_STACK};font-size:13px;color:${THEME.textMuted};">
                                ${[ticket.location?.city, ticket.location?.country].filter(Boolean).join(", ")}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- seat stats -->
        <tr>
            <td style="padding:0 28px 24px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        ${
                            seat
                                ? [
                                      statCell("Section", ticket.seat?.section || "-"),
                                      `<td width="6"></td>`,
                                      statCell("Row", ticket.seat?.row || "-"),
                                      `<td width="6"></td>`,
                                      statCell("Seat", ticket.seat?.number || "-"),
                                  ].join("")
                                : statCell("Admission", "General Admission")
                        }
                    </tr>
                </table>
            </td>
        </tr>

        ${perforation()}

        <!-- QR stub -->
        <tr>
            <td style="padding:24px 28px 28px;background:${THEME.bgAlt};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td valign="middle">
                            <p style="margin:0;font-family:${FONT_STACK};font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:${THEME.textMuted};">
                                Ticket number
                            </p>
                            <p style="margin:4px 0 12px;font-family:'Courier New',Courier,monospace;font-size:14px;font-weight:700;letter-spacing:0.04em;color:${THEME.text};">
                                ${ticket.ticketNumber}
                            </p>
                            <p style="margin:0;font-family:${FONT_STACK};font-size:12px;color:${THEME.textMuted};">
                                Present this QR code at the entrance.<br/>One scan per ticket.
                            </p>
                        </td>
                        <td width="112" align="right" valign="middle">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="background:${THEME.bg};border:1px solid ${THEME.border};border-radius:12px;">
                                <tr>
                                    <td style="padding:10px;">
                                        <img src="${ticket.qrCodeUrl}" width="90" height="90" alt="QR code for ticket ${ticket.ticketNumber}" style="display:block;border:0;width:90px;height:90px;" />
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
const eventTicketTemplate = ({ user, tickets = [], purchaseId }) => {
    const greetingName = user?.username || user?.firstName || "there";
    const ticketWord = tickets.length === 1 ? "ticket" : "tickets";

    return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="color-scheme" content="light" />
    <title>Your Spotlight tickets</title>
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
        Your Spotlight ${ticketWord} ${tickets.length > 1 ? "are" : "is"} confirmed — purchase ${purchaseId}.
        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${THEME.bgAlt};">
        <tr>
            <td align="center" style="padding:32px 16px;">
                <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="width:640px;max-width:640px;">

                    <!-- header banner -->
                    <tr>
                        <td style="padding:0;border-radius:20px 20px 0 0;overflow:hidden;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:36px 32px 32px;background-color:${THEME.gradientFallback};background-image:${THEME.gradientCss};border-radius:20px 20px 0 0;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td valign="middle">
                                                    <p style="margin:0;font-family:${FONT_STACK};font-size:20px;font-weight:800;letter-spacing:0.02em;color:#ffffff;">
                                                        Spotlight
                                                    </p>
                                                </td>
                                                <td valign="middle" align="right">
                                                    <span style="display:inline-block;padding:6px 12px;border-radius:999px;background:rgba(255,255,255,0.16);font-family:${FONT_STACK};font-size:11px;font-weight:700;letter-spacing:0.05em;color:#ffffff;">
                                                        ✓ CONFIRMED
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="margin:22px 0 0;font-family:${FONT_STACK};font-size:26px;line-height:1.3;font-weight:800;color:#ffffff;">
                                            You're going!
                                        </p>
                                        <p style="margin:8px 0 0;font-family:${FONT_STACK};font-size:14px;line-height:1.5;color:rgba(255,255,255,0.82);">
                                            Hi ${greetingName}, your purchase is confirmed. Your ${ticketWord} ${tickets.length > 1 ? "are" : "is"} below save this email or add the QR code${tickets.length > 1 ? "s" : ""} to your wallet.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- purchase id strip -->
                    <tr>
                        <td style="padding:0;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${THEME.bg};border-left:1px solid ${THEME.border};border-right:1px solid ${THEME.border};">
                                <tr>
                                    <td style="padding:16px 32px;border-bottom:1px solid ${THEME.border};">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="font-family:${FONT_STACK};font-size:12px;color:${THEME.textMuted};">
                                                    Purchase ID
                                                </td>
                                                <td align="right" style="font-family:'Courier New',Courier,monospace;font-size:12px;font-weight:700;color:${THEME.text};letter-spacing:0.03em;">
                                                    ${purchaseId}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- tickets -->
                    <tr>
                        <td style="padding:28px 32px 4px;background:${THEME.bg};border-left:1px solid ${THEME.border};border-right:1px solid ${THEME.border};">
                            ${tickets.map((ticket, i) => ticketCard(ticket, i)).join("")}
                        </td>
                    </tr>

                    <!-- entry note -->
                    <tr>
                        <td style="padding:0 32px 32px;background:${THEME.bg};border-left:1px solid ${THEME.border};border-right:1px solid ${THEME.border};">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${THEME.bgAlt};border-radius:12px;">
                                <tr>
                                    <td style="padding:16px 20px;font-family:${FONT_STACK};font-size:13px;line-height:1.6;color:${THEME.text};">
                                        <strong>Before you go:</strong> arrive at least 30 minutes early and have your QR code ready to scan at the entrance. A digital or printed copy both work.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- footer -->
                    <tr>
                        <td style="padding:28px 32px;background:${THEME.purple900};border-radius:0 0 20px 20px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="font-family:${FONT_STACK};font-size:13px;font-weight:700;color:#ffffff;padding-bottom:6px;">
                                        Spotlight
                                    </td>
                                </tr>
                                <tr>
                                    <td style="font-family:${FONT_STACK};font-size:12px;line-height:1.7;color:rgba(255,255,255,0.55);">
                                        Questions about this order? Reply to this email or visit your account for support.<br/>
                                        This ticket is non-transferable outside the Spotlight app.
                                    </td>
                                </tr>
                            </table>
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

module.exports = eventTicketTemplate;