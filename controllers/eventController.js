const Event = require('../models/Event')
const NouFoundError = require('../errors/NotFoundEror')
const BadRequestError = require('../errors/BadRequestError')
const {StatusCodes} = require('http-status-codes')
const NotFoundError = require('../errors/NotFoundEror')


//CREATION
/*const createEvent = async (req , res) => {
    const {
        celebrity,

        title,

        description,

        venue,

        location,

        eventDate,

        ticketTypes

    } = req.body;

       if (
        !celebrity ||
        !title ||
        !venue ||
        !location ||
        !eventDate
    ) {

        throw new BadRequestError(
            "Please provide all required fields"
        );

    }


    const bannerImage =
    req.files?.bannerImage?.[0]?.path || "";

    const arenaOverview =
    req.files?.arenaOverview?.[0]?.path || "";

    const image =
    req.files?.Image?.[0]?.path || "";

    const event = await Event.create({
        celebrity,

        title,

        description,

        venue,

        location,

        eventDate,

        bannerImage,

        ticketTypes,

        arenaOverview
    })

    res.status(StatusCodes.CREATED).json({
        status : "sucess",
        message : "created",
        event
    })
} */


const createEvent = async (req, res) => {
  const {
    celebrity,
    title,
    description,
    venue,
    eventDate,
  } = req.body;

  let location = JSON.parse(req.body.location);
  let ticketTypes = JSON.parse(req.body.ticketTypes);

  if (
    !celebrity ||
    !title ||
    !venue ||
    !location ||
    !eventDate
  ) {
    throw new BadRequestError(
      "Please provide all required fields"
    );
  }

  const bannerImage =
    req.files?.bannerImage?.[0]?.path || "";

  const arenaOverview =
    req.files?.arenaOverview?.[0]?.path || "";

  const ticketImages =
    req.files?.ticketImages || [];

  // Attach each uploaded image to its corresponding ticket
  ticketTypes.forEach((ticket, index) => {
    if (ticketImages[index]) {
      ticket.image = ticketImages[index].path;
    }
  });

  const event = await Event.create({
    celebrity,
    title,
    description,
    venue,
    location,
    eventDate,
    bannerImage,
    arenaOverview,
    ticketTypes,
  });

  res.status(StatusCodes.CREATED).json({
    status: "success",
    message: "Event created successfully",
    event,
  });
};


const createTickeType = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new BadRequestError(
            "Event ID not found in request"
        );
    }

    const {
        name,
        price,
        section,
        rows,
        seatsPerRow,
        cartegory,
        ticketType,
    } = req.body;

    if (
        !name ||
        !price ||
        !seatsPerRow ||
        !cartegory ||
        !ticketType
    ) {
        throw new BadRequestError(
            "Please provide all required ticket fields"
        );
    }

    const event = await Event.findById(id);

    if (!event) {
        throw new NotFoundError(
            "Could not find event"
        );
    }

    let parsedRows = [];

    if (rows) {
        try {
            parsedRows = JSON.parse(rows);
        } catch {
            parsedRows = [];
        }
    }

    const image = req.file?.path || "";

    const newTicketType = {
        name,
        price,
        section,
        rows: parsedRows,
        seatsPerRow,
        cartegory,
        ticketType,
        image,
    };

    event.ticketTypes.push(newTicketType);

    await event.save();

    const createdTicket =
        event.ticketTypes[
            event.ticketTypes.length - 1
        ];

    res.status(StatusCodes.CREATED).json({
        status: "success",
        message: "New ticket type added",
        ticket: createdTicket,
    });
};

/*
const createTickeType = async ( req , res ) => {
    const {id} = req.params

    const {
        name,
        price,
        rows,
        seatsPerRow
    } = req.body;

    if (!name || !price || !seatsPerRow) {
        throw new BadRequestError(
            "Please provide name, price and seatsPerRow"
        );
    }

    if (!id) {
        throw new BadRequestError("event id not found in request")
    }

    const event = await Event.findById(id)

    const image = req.file?.path || "";

    if  (!event) {
        throw new NotFoundError('could not find event')
    }


    const newTicketType = {
        name,
        price,
        rows: rows || [],
        seatsPerRow,
        image
    }


    event.ticketTypes.push(newTicketType)

    const newTicket = await event.save()

        res.status(StatusCodes.OK).json({
        status: "success",
        message: " New ticket type added",
        ticket : newTicket
    });
}*/




//UPDATING

/*const updateEvent  = async (req , res) => {
    const {id} = req.params

    const {
        celebrity,

        title,

        description,

        venue,

        location,

        eventDate,

    } = req.body;


    if (!id) {
        throw new BadRequestError("id not present in request")
    }

    
    const event = await Event.findById(id)

    //CHECK

    if (!event) {
        throw new NotFoundError('could not find this event')
    }


    if (celebrity !== undefined) {
       event.celebrity = celebrity
    }

    if (title !== undefined) {
        event.title = title
    }

    if (description !== undefined) {
        event.description = description
    }

    if (venue !== undefined) {
        event.venue = venue
    }

    if (eventDate !== undefined) {
        event.eventDate = eventDate
    }


    if (location) {

    if (location.name !== undefined)
        event.location.name =
            location.name;

    if (location.address !== undefined)
        event.location.address =
            location.address;

    if (location.city !== undefined)
        event.location.city =
            location.city;

    if (location.country !== undefined)
        event.location.country =
            location.country;

    }


    await event.save()
  res.status(StatusCodes.ACCEPTED).json({
    message : "updated document sucessfully",
    event
  })
     
}*/


/*const updateEvent = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError("ID not present in request");
  }

  const event = await Event.findById(id);

  if (!event) {
    throw new NotFoundError("Could not find this event");
  }

  let {
    celebrity,
    title,
    description,
    venue,
    location,
    eventDate,
  } = req.body;

  // Parse location if it comes from FormData
  if (location) {
    location = JSON.parse(location);
  }

  // Update images if new ones were uploaded
  if (req.files?.bannerImage?.[0]) {
    event.bannerImage = req.files.bannerImage[0].path;
  }

  if (req.files?.arenaOverview?.[0]) {
    event.arenaOverview = req.files.arenaOverview[0].path;
  }

  if (celebrity !== undefined) {
    event.celebrity = celebrity;
  }

  if (title !== undefined) {
    event.title = title;
  }

  if (description !== undefined) {
    event.description = description;
  }

  if (venue !== undefined) {
    event.venue = venue;
  }

  if (eventDate !== undefined) {
    event.eventDate = eventDate;
  }

  if (location) {
    if (location.name !== undefined)
      event.location.name = location.name;

    if (location.address !== undefined)
      event.location.address = location.address;

    if (location.city !== undefined)
      event.location.city = location.city;

    if (location.country !== undefined)
      event.location.country = location.country;
  }

  await event.save();

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Event updated successfully",
    event,
  });
};*/


const updateEvent = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError("ID not present in request");
  }

  const event = await Event.findById(id);

  if (!event) {
    throw new NotFoundError("Could not find this event");
  }

  let {
    celebrity,
    title,
    description,
    venue,
    location,
    eventDate,
    ticketTypes,
  } = req.body;

  // Parse FormData JSON strings
  if (location) {
    location = JSON.parse(location);
  }

  if (ticketTypes) {
    ticketTypes = JSON.parse(ticketTypes);
  }

  // Replace event images if new ones were uploaded
  if (req.files?.bannerImage?.[0]) {
    event.bannerImage = req.files.bannerImage[0].path;
  }

  if (req.files?.arenaOverview?.[0]) {
    event.arenaOverview = req.files.arenaOverview[0].path;
  }

  // Update basic fields
  if (celebrity !== undefined) {
    event.celebrity = celebrity;
  }

  if (title !== undefined) {
    event.title = title;
  }

  if (description !== undefined) {
    event.description = description;
  }

  if (venue !== undefined) {
    event.venue = venue;
  }

  if (eventDate !== undefined) {
    event.eventDate = eventDate;
  }

  // Update location
  if (location) {
    event.location = {
      ...event.location.toObject(),
      ...location,
    };
  }

  // Replace all ticket types
  if (ticketTypes) {
    event.ticketTypes = ticketTypes;
  }

  await event.save();

  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Event updated successfully",
    event,
  });
};



const updateTicketType = async (
    req,
    res
) => {

    const {
        eventId,
        ticketTypeId
    } = req.params;

    const {
        name,
        price,
        rows,
        seatsPerRow
    } = req.body;

    // find parent event
    const event =
        await Event.findById(eventId);

    if (!event) {
        throw new NotFoundError(
            "Event not found"
        );
    }

    // find ticket type inside array
    const ticketType =
        event.ticketTypes.id(
            ticketTypeId
        );

    if (!ticketType) {
        throw new NotFoundError(
            "Ticket type not found"
        );
    }

    // update only provided fields
    if (name)
        ticketType.name = name;

    if (price)
        ticketType.price = price;

    if (rows)
        ticketType.rows = rows;

    if (seatsPerRow)
        ticketType.seatsPerRow =
            seatsPerRow;

    // save updated event
    await event.save();

    res.status(StatusCodes.OK).json({

        status: "success",

        message:
            "Ticket type updated",

        event

    });

};



const deleteEvent = async (
    req,
    res
) => {

    const { id } = req.params;

    const event =
        await Event.findByIdAndDelete(id);

    if (!event) {

        throw new NotFoundError(
            "Event not found"
        );

    }

    res.status(200).json({

        status: "success",

        message:
            "Event deleted"

    });

};


const deleteTicketType = async (req , res) => {
    const {
        eventId,
        ticketTypeId
    } = req.params


    if (!eventId || !ticketTypeId) {
        throw new BadRequestError("eventId OR ticketID is missing from request")
    }


    const event = await Event.findById(eventId)

    if (!event) {
        throw new NotFoundError("event not found")
    }

    const ticketType = await event.ticketTypes.id(ticketTypeId)

    if (!ticketType) {
        throw new NotFoundError("ticket type not found")
    } 
    
    
    event.ticketTypes.pull(ticketTypeId)
    
    await event.save()
    

    res.status(StatusCodes.OK).json({

        status: "success",

        message:
            "Ticket type deleted",

        event

    });
}


const getAllEvents = async (req , res) => {
    const events = await Event.find()

    res.status(StatusCodes.OK).json({
        status: "sucess",
        events
    })
}


const getEvent = async (req , res) => {
    const {id} = req.params

    if (!id) {
        throw new BadRequestError("id not found in request")
    }

    const event = await Event.findById(id)

    res.status(StatusCodes.OK).json({
        status : "sucess",
        event
    })
}


const getCelebrityEvents = async (req , res) => {
   const {id} = req.params

   if (!id) {
    throw new BadRequestError("no id present in this request")
   }

   const events = await Event.find({celebrity : id})

   if (!events) {
    throw new NotFoundError("could not find any event with the provided search parameter ")
   }

   res.status(StatusCodes.OK).json({
    status : "success",
    events
   })
}





module.exports = {
    createEvent,
    createTickeType,
    updateEvent,
    updateTicketType,
    deleteEvent,
    deleteTicketType,
    getAllEvents,
    getEvent,
    getCelebrityEvents
}

