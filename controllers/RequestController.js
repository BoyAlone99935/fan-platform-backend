const NouFoundError = require('../errors/NotFoundEror')
const BadRequestError = require('../errors/BadRequestError')
const {StatusCodes} = require('http-status-codes')
const NotFoundError = require('../errors/NotFoundEror')
const Request = require('../models/MeetRequest')
const Celebrity = require('../models/Celebrity')
const User = require('../models/User')
const sendRequestMail = require('../utils/requestMail')
const sendOfferMail = require('../utils/offerMail')
const sendMail = require('../utils/sendMeetBookingMail')
const createRequest = async (req , res) => {
    const {
    slug,
    message,
    preferredLocation,
  } = req.body;
  

  if (!slug) {
    throw new BadRequestError(
        "Celebrity slug is required"
    );
   }

  const celebrityDoc = await Celebrity.findOne({slug : slug})

  if (!celebrityDoc) {
    throw new NotFoundError(
        "Celebrity not found"
    );
  }

  const celebrity = celebrityDoc._id

    if (!celebrity) {
    throw new BadRequestError("location not found in the request")
  }
  const user = req.user.userId
  const usermail = await User.findById(user)
  if (!usermail) {
    throw new BadRequestError('this user not found')
  }
  
  await sendRequestMail(usermail)
  const request = await Request.create({
    user,
    celebrity,
    preferredLocation,
    message
  })

  
  res.status(StatusCodes.CREATED).json({
    message : "request created",
    request
  })
}


const createOffer = async (req , res) => {
    const {
        price,
        message,
        date
    } = req.body;

    let location = {};

    if (req.body.location) {
        location = JSON.parse(req.body.location);
    }

    const {
    name,
    address,
    city,
    country
   } = location;
  
    const { id } = req.params;

    if(!id) {
        throw new BadRequestError('request id not present in request')
    }

    const request = await Request.findById(id)

    if (!request) {
        throw new NotFoundError("could not find this request")
    }

    if (
        !price ||
        !message ||
        !date ||
        !location?.name ||
        !location?.city ||
        !location?.country
    ) {
        throw new BadRequestError(
            "Missing required offer fields"
        );
    }

 
    
    const image = req.file?.path || ""

    const offer = {
        price,
        message,
        date,
        location: {
            name,
            address,
            city,
            country,
            image
        },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    request.offer = offer
    request.status = "offered"
    await request.save()
    
    const user = await User.findById(request.user._id)

    if (!user) {
        throw new NotFoundError('could not find user')
    }

    await sendOfferMail(user)

    res.status(StatusCodes.CREATED).json({
        status : "success",
        request
    })
}



const acceptOffer = async (req , res) => {
    const { id } = req.params;

    if(!id) {
        throw new BadRequestError('request id not present in request')
    }
    
    const request = await Request.findById(id)


    if (!request) {
        throw new NotFoundError("could not find this request")
    }


    if (request.status !== "offered") {
        throw new BadRequestError(
            "Only offered requests can be accepted"
        );
    }

    if (new Date() > request.offer.expiresAt) {

        request.status = "expired"

        await request.save()

        throw new BadRequestError(
            "This offer has expired"
        );
    }


    request.status = "accepted"
    request.acceptedAt = new Date()
    await request.save()

    res.status(StatusCodes.OK).json({
        status : "success",
        message : "offer accepted",
        request
    })


}


const rejectOffer = async (req , res) => {
    const { id } = req.params; 

    if (!id) {
        throw new BadRequestError('request id not present in request')
    }

    const request = await Request.findById(id)

    if (!request) {
        throw new NotFoundError("could not find this request")
    }

    if (request.status !== "offered") {
        throw new BadRequestError(
            "Only offered requests can be rejected"
        );
    }

    request.status = "rejected"
    await request.save()

    res.status(StatusCodes.OK).json({
        status : "success",
        message : "offer rejected",
        request
    })
}

const updatePaymentStatus = async (req , res) => {
    const {id} = req.params

    if (!id) {
        throw new BadRequestError('id not present in request')
    }

    const request = await Request.findById(id)

    if (!request) {
        throw new NotFoundError("could not find this request")
    }

    if (request.status !== "accepted") {
        throw new BadRequestError(
            "Only accepted requests can be marked as paid"
        );
    }

    const user = await User.findById(request.user)

    if (!user) {
        throw new NotFoundError("could not find user")
    }

    request.isPaid = true
    await request.save()
    await sendMail(user , request)
    

    res.status(StatusCodes.OK).json({
        status : "success",
        message : "updated"
    })

}



// GET ALL REQUESTS
const getAllRequests = async (req, res) => {
    const { status } = req.query;

    const query = {};

    if (status) {
        query.status = status;
    }

    const requests = await Request.find(query)
        .populate("user", "username email")
        .populate("celebrity", "name profileImage slug")
        .sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
        status: "success",
        count: requests.length,
        requests,
    });
};


const getPendingPayments = async (req, res) => {

    const requests = await Request.find({
        status: "accepted",
        isPaid: false
    })
    .populate("user", "username email")
    .populate("celebrity", "name profileImage");

    res.status(StatusCodes.OK).json({
        success: true,
        count: requests.length,
        requests
    });

}


// GET SINGLE REQUEST
const getRequest = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new BadRequestError(
            "Request ID not present in request"
        );
    }

    const request = await Request.findById(id)
        .populate("user", "username email")
        .populate("celebrity", "name profileImage slug");

    if (!request) {
        throw new NotFoundError(
            "Request not found"
        );
    }

    res.status(StatusCodes.OK).json({
        status: "success",
        request,
    });
};

const getCompletedMeetPurchases = async (req, res) => {

    const requests = await Request.find({
        isPaid: true
    })
    .populate("user", "username email")
    .populate("celebrity", "name profileImage slug")
    .sort({ updatedAt: -1 });

    res.status(StatusCodes.OK).json({
        success: true,
        count: requests.length,
        requests
    });

};

module.exports = {
    createOffer,
    createRequest,
    rejectOffer,
    acceptOffer,
    getAllRequests,
    getRequest,
    getPendingPayments,
    updatePaymentStatus,
    getCompletedMeetPurchases
}
    