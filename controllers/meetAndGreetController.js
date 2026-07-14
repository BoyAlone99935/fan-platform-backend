const MeetAndGreet = require('../models/MeetAndGreet')
const NouFoundError = require('../errors/NotFoundEror')
const BadRequestError = require('../errors/BadRequestError')
const {StatusCodes} = require('http-status-codes')
const NotFoundError = require('../errors/NotFoundEror')


const createMeetAndGreet = async (req , res) => {
    const {
        celebrity,
        title,
        type,
        description,
        price,
        capacity,
        date,
        duration,
        location,
        city,
        country,
        perks
    } = req.body


       if (
        !celebrity ||
        !title ||
        !type ||
        !price ||
        !capacity ||
        !date ||
        !location?.name ||
        !location?.city ||
        !location?.country||
        !location?.address
    ) {

        throw new BadRequestError(
            "Please provide all required fields"
        );
    }


    const images = req.files.map(file => file.path) || []
    

    const meetAndGreet = await MeetAndGreet.create({
        celebrity,
        title,
        type,
        description,
        price,
        capacity,
        date,
        duration,
        location,
        city,
        country,
        perks,
        images
    })


    res.status(StatusCodes.CREATED).json({
        status : "created",
        meetAndGreet
    })
}



const updateMeetAndGreet = async (req, res) => {

    const { id } = req.params;

    if (!id) {
        throw new BadRequestError(
            "id not present in request"
        );
    }

    const meetAndGreet =
        await MeetAndGreet.findById(id);

    if (!meetAndGreet) {
        throw new NotFoundError(
            "Meet and greet not found"
        );
    }

    const {
        celebrity,
        title,
        type,
        description,
        price,
        capacity,
        date,
        duration,
        location,
        perks,
        isActive
    } = req.body;

    if (celebrity !== undefined)
        meetAndGreet.celebrity = celebrity;

    if (title !== undefined)
        meetAndGreet.title = title;

    if (type !== undefined)
        meetAndGreet.type = type;

    if (description !== undefined)
        meetAndGreet.description = description;

    if (price !== undefined)
        meetAndGreet.price = price;

        if (
        capacity !== undefined &&
        capacity < meetAndGreet.bookedCount
        ) {
        throw new BadRequestError(
            `Capacity cannot be less than booked count (${meetAndGreet.bookedCount})`
        );
      }

    if (capacity !== undefined)
        meetAndGreet.capacity = capacity;

    if (date !== undefined)
        meetAndGreet.date = date;

    if (duration !== undefined)
        meetAndGreet.duration = duration;

    if (perks !== undefined)
        meetAndGreet.perks = perks;

    if (isActive !== undefined)
        meetAndGreet.isActive = isActive;


    // Nested location updates
    if (location) {

        if (location.name !== undefined)
            meetAndGreet.location.name =
                location.name;

        if (location.address !== undefined)
            meetAndGreet.location.address =
                location.address;

        if (location.city !== undefined)
            meetAndGreet.location.city =
                location.city;

        if (location.country !== undefined)
            meetAndGreet.location.country =
                location.country;
    }


    // Images
    if (req.files?.length) {

        meetAndGreet.images =
            req.files.map(
                file => file.path
            );

    }

    await meetAndGreet.save();

    res.status(StatusCodes.OK).json({

        status: "success",

        message:
            "Meet and greet updated successfully",

        meetAndGreet

    });

};

const deleteMeetAndGreet = async (req , res) => {
    const {id} = req.params

    if (!id) {
        throw new BadRequestError("id not found in request")
    }

    const meetAndGreet = await MeetAndGreet.findById(id)

    if (!meetAndGreet) {
        throw new NotFoundError('could not find an event with this id')
    }

    await meetAndGreet.deleteOne()

    res.status(StatusCodes.OK).json({
        status : "sucess",
        message : "meet and greet deleted"
    })
}


const getAllMeetAndGreets = async (
    req,
    res
) => {

    const meetAndGreets =
        await MeetAndGreet.find()
            .populate(
                "celebrity",
                "name slug"
            )
            .sort("-createdAt");

    res.status(StatusCodes.OK).json({

        status: "success",

        count:
            meetAndGreets.length,

        meetAndGreets

    });

};


const getSingleMeetAndGreet =
    async (req, res) => {

        const { id } = req.params;

        if (!id) {
            throw new BadRequestError(
                "id not present in request"
            );
        }

        const meetAndGreet =
            await MeetAndGreet.findById(id)
                .populate(
                    "celebrity",
                    "name slug"
                );

        if (!meetAndGreet) {
            throw new NotFoundError(
                "Meet and greet not found"
            );
        }

        res.status(
            StatusCodes.OK
        ).json({

            status: "success",

            meetAndGreet

        });

};


module.exports = {
    getAllMeetAndGreets,
    getSingleMeetAndGreet,
    deleteMeetAndGreet,
    updateMeetAndGreet,
    createMeetAndGreet
}