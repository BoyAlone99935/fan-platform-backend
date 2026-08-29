const { StatusCodes } = require("http-status-codes");
const mongoose = require("mongoose");

const Ticket = require("../models/Ticket");
const Request = require("../models/MeetRequest");
const User = require("../models/User");
const Event = require("../models/Event");
const MeetEvent = require("../models/MeetAndGreet");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundEror");

const sendMail = require("../utils/sendTicketDetails");
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

            const generatedSeat = {
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
        ticketId,
        meetId
    } = req.body;


    // ==========================================
    // BASIC VALIDATION
    // ==========================================

    if (!bookingType || !paymentType) {
        throw new BadRequestError(
            "bookingType and paymentType are required"
        );
    }


    // ==========================================
    // FIND USER
    // ==========================================

    const foundUser = await User.findById(userId);

    if (!foundUser) {
        throw new NotFoundError(
            "User not found"
        );
    }


    // ==========================================
    // VARIABLES
    // ==========================================

    let foundEvent = null;
    let foundRequest = null;
    let foundMeetEvent = null;
    let selectedTicket = null;


    // ==========================================
    // EVENT BOOKING
    // ==========================================

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


        // Find event
        foundEvent =
            await Event.findById(eventId);

        if (!foundEvent) {
            throw new NotFoundError(
                "Event not found"
            );
        }


        // Find selected ticket type
        selectedTicket =
            foundEvent.ticketTypes.id(ticketId);

        if (!selectedTicket) {
            throw new NotFoundError(
                "Ticket type not found"
            );
        }
    }


    // ==========================================
    // MEET & GREET BOOKING
    // ==========================================

    if (bookingType === "meet_and_greet") {

        const id =
            meetId || privateMeetId;

        if (!id) {
            throw new BadRequestError(
                "MeetId is required"
            );
        }


        // Find Meet & Greet
        foundMeetEvent =
            await MeetEvent.findById(id);

        if (!foundMeetEvent) {
            throw new NotFoundError(
                "Meet and greet not found"
            );
        }
    }


    // ==========================================
    // PURCHASE ID
    // ==========================================

    const purchaseId =
        generateTicketPurchaseId();


    // ==========================================
    // QUANTITY
    // ==========================================

    const ticketQuantity =
        quantity || 1;


    // ==========================================
    // TICKETS ARRAY
    // ==========================================

    const tickets = [];


    // ==========================================
    // BOOKED SEATS
    // ==========================================

    const bookedSeats = [];


    // ==========================================
    // CREATE TICKETS
    // ==========================================

    for (
        let i = 0;
        i < ticketQuantity;
        i++
    ) {

        const ticketNumber =
            generateTicketNumber();


        let generatedSeat;


        // ======================================
        // RESERVED EVENT SEAT
        // ======================================

        if (
            bookingType === "event" &&
            selectedTicket.ticketType === "Reserved"
        ) {

            generatedSeat =
                generateSeat({
                    section:
                        selectedTicket.section,

                    rows:
                        selectedTicket.rows,

                    seatsPerRow:
                        selectedTicket.seatsPerRow,

                    bookedSeats
                });

            console.log(generatedSeat);
        }


        // ======================================
        // CREATE TICKET
        // ======================================

        const ticket =
            await Ticket.create({

                // ===============================
                // SHARED
                // ===============================

                user:
                    foundUser._id,

                purchaseId,

                email:
                    foundUser.email,


                celebrity:
                    bookingType === "event"
                        ? foundEvent.celebrity
                        : foundMeetEvent.celebrity,


                bookingType,

                ticketNumber,


                title:
                    bookingType === "event"
                        ? foundEvent.name
                        : foundMeetEvent.title,


                paymentType,


                paymentStatus:
                    paymentType === "usdt"
                        ? "paid"
                        : "pending",


                amount:
                    bookingType === "event"
                        ? selectedTicket.price
                        : foundMeetEvent.price,


                paid: true,

                paidAt:
                    new Date(),


                date:
                    bookingType === "event"
                        ? foundEvent.eventDate
                        : foundMeetEvent.date,


                location:
                    bookingType === "event"
                        ? foundEvent.location
                        : foundMeetEvent.location,


                status:
                    "active",


                arrangedPayment,


                // ===============================
                // EVENT
                // ===============================

                event:
                    bookingType === "event"
                        ? foundEvent._id
                        : undefined,


                category:
                    bookingType === "event"
                        ? selectedTicket.name
                        : undefined,


                quantity:
                    1,


                seat:
                    bookingType === "event" &&
                    selectedTicket.ticketType === "Reserved"
                        ? generatedSeat
                        : undefined,


                // ===============================
                // MEET & GREET
                // ===============================

                request:
                    undefined,


                message:
                    undefined
            });


        tickets.push(ticket);
    }


    // ==========================================
    // SEND TICKET / RESERVATION EMAIL
    // ==========================================

    if (paymentType === "usdt") {

        await sendTicketDetails(
            foundUser,
            tickets,
            purchaseId
        );
    }


    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(StatusCodes.CREATED).json({

        success: true,

        purchaseId,

        count:
            tickets.length,

        tickets,

        email:
            "sent"
    });
};



const confirmPayment = async (req , res) => {
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
    confirmPayment,
    getAllPurchases,
    getUserPurchases,
    getUnconfirmedPurchases
};