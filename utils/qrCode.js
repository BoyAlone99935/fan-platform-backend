const QRCode = require("qrcode");

const generateQRCode = async (data) => {

    try {

        const qrString =
            typeof data === "string"
                ? data
                : JSON.stringify(data);

        const qrCode = await QRCode.toDataURL(qrString);

        return qrCode;

    } catch (error) {
        throw new Error("QR Code generation failed");
    }
};

module.exports = generateQRCode;