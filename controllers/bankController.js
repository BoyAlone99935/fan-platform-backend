const { StatusCodes } = require("http-status-codes");

const BankPayment = require('../models/Bank')

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundEror");


// =====================================
// CREATE PAYMENT METHOD
// =====================================

const createPaymentMethod = async (req, res) => {

    const {
        provider,
        type,
        accountName,
        bankName,
        accountNumber,
        iban,
        swiftCode,
        routingNumber,
        sortCode,
        transitNumber,
        institutionNumber,
        bsb,
        email,
        phoneNumber,
        country,
        currency,
        instructions,
        active
    } = req.body;

    if (!provider) {
        throw new BadRequestError(
            "Provider is required."
        );
    }

    const logo = req.file?.path || "";

    const paymentMethod =
        await BankPayment.create({

            provider,
            type,

            logo,

            accountName,

            bankName,

            accountNumber,

            iban,

            swiftCode,

            routingNumber,

            sortCode,

            transitNumber,

            institutionNumber,

            bsb,

            email,

            phoneNumber,

            country,

            currency,

            instructions,

            active

        });

    res.status(StatusCodes.CREATED).json({

        success: true,

        paymentMethod

    });

};


// =====================================
// GET ALL PAYMENT METHODS
// =====================================

const getPaymentMethods = async (req, res) => {

    const paymentMethods =
        await BankPayment.find()
            .sort({
                createdAt: -1
            });

    res.status(StatusCodes.OK).json({

        success: true,

        count: paymentMethods.length,

        paymentMethods

    });

};


// =====================================
// GET SINGLE PAYMENT METHOD
// =====================================

const getPaymentMethod = async (req, res) => {

    const { id } = req.params;

    const paymentMethod =
        await BankPayment.findById(id);

    if (!paymentMethod) {

        throw new NotFoundError(
            "Payment method not found."
        );

    }

    res.status(StatusCodes.OK).json({

        success: true,

        paymentMethod

    });

};


// =====================================
// DELETE PAYMENT METHOD
// =====================================

const deletePaymentMethod = async (req, res) => {

    const { id } = req.params;

    const paymentMethod =
        await BankPayment.findById(id);

    if (!paymentMethod) {

        throw new NotFoundError(
            "Payment method not found."
        );

    }

    await paymentMethod.deleteOne();

    res.status(StatusCodes.OK).json({

        success: true,

        message:
            "Payment method deleted successfully."

    });

};


// =====================================
// UPDATE PAYMENT METHOD
// =====================================

const updatePaymentMethod = async (req, res) => {

    const { id } = req.params;

    const paymentMethod =
        await BankPayment.findById(id);

    if (!paymentMethod) {

        throw new NotFoundError(
            "Payment method not found."
        );

    }

    const {
        provider,
        type,
        accountName,
        bankName,
        accountNumber,
        iban,
        swiftCode,
        routingNumber,
        sortCode,
        transitNumber,
        institutionNumber,
        bsb,
        email,
        phoneNumber,
        country,
        currency,
        instructions,
        active
    } = req.body;

    if (provider !== undefined)
        paymentMethod.provider = provider;

    if (type !== undefined)
        paymentMethod.type = type;

    if (accountName !== undefined)
        paymentMethod.accountName = accountName;

    if (bankName !== undefined)
        paymentMethod.bankName = bankName;

    if (accountNumber !== undefined)
        paymentMethod.accountNumber = accountNumber;

    if (iban !== undefined)
        paymentMethod.iban = iban;

    if (swiftCode !== undefined)
        paymentMethod.swiftCode = swiftCode;

    if (routingNumber !== undefined)
        paymentMethod.routingNumber = routingNumber;

    if (sortCode !== undefined)
        paymentMethod.sortCode = sortCode;

    if (transitNumber !== undefined)
        paymentMethod.transitNumber = transitNumber;

    if (institutionNumber !== undefined)
        paymentMethod.institutionNumber = institutionNumber;

    if (bsb !== undefined)
        paymentMethod.bsb = bsb;

    if (email !== undefined)
        paymentMethod.email = email;

    if (phoneNumber !== undefined)
        paymentMethod.phoneNumber = phoneNumber;

    if (country !== undefined)
        paymentMethod.country = country;

    if (currency !== undefined)
        paymentMethod.currency = currency;

    if (instructions !== undefined)
        paymentMethod.instructions = instructions;

    if (active !== undefined)
        paymentMethod.active = active;

    if (req.file) {
        paymentMethod.logo = req.file.path;
    }

    await paymentMethod.save();

    res.status(StatusCodes.OK).json({

        success: true,

        paymentMethod

    });

};


module.exports = {

    createPaymentMethod,

    getPaymentMethods,

    getPaymentMethod,

    deletePaymentMethod,

    updatePaymentMethod

};