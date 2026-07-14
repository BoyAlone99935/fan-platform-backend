const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");
const Ticket = require("../models/Ticket");
const Request = require("../models/MeetRequest");
const User = require("../models/User");
const Event = require("../models/Event");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundEror");
//const generateQrCode = require('../utils/qrCode')
const sendMail = require('../utils/sendTicketDetails');
const sendTicketDetails = require("../utils/sendTicketDetails");
 
const generateTicketPurchaseId = () => {
    return `PUR-${Date.now()}-${Math.floor(Math.random() * 10)}`;
};

const generateTicketNumber = () => {
    return `TICKET-${Date.now()}-${Math.floor(Math.random() * 10)}`;
};




const generateSeat = ({
    section,
    rows,
    seatsPerRow,
    bookedSeats = []
}) => {

    while (true) {

        const randomRow =
            rows[Math.floor(Math.random() * rows.length)];

        const randomSeat =
            Math.floor(Math.random() * seatsPerRow) + 1;

        const seatExists = bookedSeats.some(seat =>
            seat.section === section &&
            seat.row === randomRow &&
            seat.number === randomSeat.toString()
        );

        if (!seatExists) {
             generatedSeat = {
                section,
                row: randomRow,
                number: randomSeat.toString()
            };

            bookedSeats.push(generatedSeat);

            return generatedSeat;
        }

    }

};

const createTicket = async (req, res) => {

    const userId = req.user.userId;
    

    const {
        bookingType,
        quantity,
        paymentType,
        arrangedPayment,
        eventId,
        privateMeetId,
        ticketId
    } = req.body;

    

    if (!bookingType || !paymentType) {
        throw new BadRequestError(
            "bookingType and paymentType are required"
        );
    }

    const foundUser = await User.findById(userId);

    if (!foundUser) {
        throw new NotFoundError(
            "User not found"
        );
    }

    let foundEvent = null;
    let foundRequest = null;
    let selectedTicket = null;

    if (bookingType === "event") {

        if (!eventId) {
            throw new BadRequestError(
                "eventId is required"
            );
        }

        if (!ticketId) {
            throw new BadRequestError(
                "ticketId is required"
            );
        }

        foundEvent = await Event.findById(eventId);

        if (!foundEvent) {
            throw new NotFoundError(
                "Event not found"
            );
        }

        selectedTicket =
            foundEvent.ticketTypes.id(ticketId);

        if (!selectedTicket) {
            throw new NotFoundError(
                "Ticket type not found"
            );
        }
    }

    if (bookingType === "meet_and_greet") {

        if (!privateMeetId) {
            throw new BadRequestError(
                "privateMeetId is required"
            );
        }

        foundRequest =
            await Request.findById(privateMeetId);

        if (!foundRequest) {
            throw new NotFoundError(
                "Request not found"
            );
        }
    }

    const purchaseId =
        generateTicketPurchaseId();

    const ticketQuantity =
        bookingType === "event"
            ? quantity || 1
            : 1;

    const tickets = [];

   
    const bookedSeats = [];
    for (let i = 0; i < ticketQuantity; i++) {

        const ticketNumber =
            generateTicketNumber();

        let generatedSeat;

        if (
            bookingType === "event" &&
            selectedTicket.ticketType === "Reserved"
        ) {
            generatedSeat = generateSeat({
            section: selectedTicket.section,
            rows: selectedTicket.rows,
            seatsPerRow: selectedTicket.seatsPerRow,
            bookedSeats
            });

            console.log(generatedSeat)
        }


     

        const ticket =
            await Ticket.create({

                // =====================
                // SHARED
                // =====================

                user: foundUser._id,

                purchaseId,

                email: foundUser.email,

                celebrity:
                    bookingType === "event" 
                        ? foundEvent.celebrity
                        : foundRequest.celebrity, 

                bookingType,

                ticketNumber,

                title : foundEvent.title,

                paymentType,

                paymentStatus: "paid",

                amount:
                    bookingType === "event"
                        ? selectedTicket.price
                        : foundRequest.offer.price,

                paid: true,

                paidAt: new Date(),

                date:
                    bookingType === "event"
                        ? foundEvent.eventDate
                        : foundRequest.offer.date,

                location:
                    bookingType === "event"
                        ? foundEvent.location
                        : foundRequest.offer.location,

                status: "active",

                arrangedPayment,


                // =====================
                // EVENT
                // =====================

                event:
                    bookingType === "event"
                        ? foundEvent._id
                        : undefined,

                category:
                    bookingType === "event"
                        ? selectedTicket.name
                        : undefined,

                quantity: 1,

                seat:
                    bookingType === "event" && foundEvent.ticketTypes.id(ticketId).ticketType === "Reserved"
                        ? generatedSeat
                        : {section : selectedTicket?.section},
                        

                // =====================
                // MEET & GREET
                // =====================

                request:
                    bookingType === "meet_and_greet"
                        ? foundRequest._id
                        : undefined,

                message:
                    bookingType === "meet_and_greet"
                        ? foundRequest.offer.message
                        : undefined
            });

        tickets.push(ticket);


    }

    if (paymentType === "usdt") {
        await sendTicketDetails(user , tickets , purchaseId)
    }

    res.status(StatusCodes.CREATED).json({
        success: true,
        purchaseId,
        count: tickets.length,
        tickets,
        email : "sent"
    });
};

module.exports = {
    createTicket
};



const comfirmPayment = async (req , res) => {
    const {purchaseId} = req.body

    const ticket = await Ticket.updateMany(
        {purchaseId},
        {
            $set: {
            arrangedPayment: false
            }
        }
    );


    if (!ticket) {
        throw new NotFoundError("could not find ticket")
    }


    const tickets = await Ticket.find({purchaseId})
    
    const userId = tickets?.[0].user
    
    if (!userId) {
        throw new NotFoundError("could not find userId in request")
    }

    const user = await User.findById(userId)

    await sendTicketDetails(user , tickets , purchaseId)

    res.status(StatusCodes.CREATED).json({
      email : "sent",
      message : "sucessfully updated"
    })

}


const getUncomfirmedPurchases = async (req , res) => {

    const purchases = await Ticket.aggregate([
        {
            $match: {
            arrangedPayment: true
            }
        },
        {
            $group: {
            _id: "$purchaseId",
            tickets: {
                $push: "$$ROOT"
            }
            }
        },
        {
            $project: {
            _id: 0,
            purchaseId: "$_id",
            tickets: 1
            }
        }
    ]);

    res.status(200).json({ purchases });
}


const getUserPurchases = async (req, res) => {
    const {userId} = req.user

    const purchases = await Ticket.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: "$purchaseId",
                tickets: {
                    $push: "$$ROOT"
                }
            }
        },
        {
            $project: {
                _id: 0,
                purchaseId: "$_id",
                tickets: 1
            }
        }
    ]);

    res.status(200).json({
        success: true,
        count: purchases.length,
        purchases
    });
};


const getAllPurchases = async (req, res) => {
    const purchases = await Ticket.aggregate([
        {
            $group: {
                _id: "$purchaseId",
                tickets: {
                    $push: "$$ROOT"
                }
            }
        },
        {
            $project: {
                _id: 0,
                purchaseId: "$_id",
                tickets: 1
            }
        }
    ]);

    res.status(200).json({
        success: true,
        count: purchases.length,
        purchases
    });
};


module.exports = {
    createTicket,
    comfirmPayment,
    getAllPurchases,
    getUserPurchases,
    getUncomfirmedPurchases
};