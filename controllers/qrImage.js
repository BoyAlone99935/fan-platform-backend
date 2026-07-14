const QRCode = require("qrcode");

const generateQRCode = async (req, res) => {
  try {
    const { ticketNumber } = req.params;

    const qrBuffer = await QRCode.toBuffer(ticketNumber, {
      type: "png",
      width: 300,
      margin: 1,
    });

    res.setHeader("Content-Type", "image/png");
    res.send(qrBuffer);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to generate QR code",
    });
  }
};

module.exports = { generateQRCode };