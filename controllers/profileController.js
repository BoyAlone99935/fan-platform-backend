const Celebrity = require('../models/Celebrity')
const  {StatusCodes} =  require('http-status-codes')
const BadRequestError = require('../errors/BadRequestError')
const NotFoundError = require('../errors/NotFoundEror')
const createCelebrityProfile = async (req , res) => {
    const {
        name,
        slug,
        bio,
        category,
        instagram,
        twitter,
        youtube
    } = req.body;

    if (!category) {
        throw new BadRequestError("NO CELEBRITY INSIDE REQ.BODY")
    }


        if (
        !name ||
        !slug
    ) {

        throw new BadRequestError(
            "Please provide name and slug"
        );

    }


    const profileImage = req.files?.profileImage?.[0].path || "";
    const coverImage = req.files?.coverImage?.[0].path || ""


    const celebrity = await Celebrity.create({

        name,

        slug,

        bio,

        category,

        profileImage,

        coverImage,

        socialLinks: {

            instagram,

            twitter,

            youtube

        }

    });


    res.status(StatusCodes.CREATED).json({
        message : "celebrity created",
        celebrity
    })

      
};




const getAllCelebrities = async (req , res) => {
  const celebrities = await Celebrity.find()
  if (!celebrity) {
    throw new NotFoundError(
        "celebrity not found"
    )
  }   
  res.status(200).json({

    status: "success",

    count:
        celebrities.length,

    celebrities

    });
}


const celebrity = async (req , res) => {
    const {id} = req.params

    if(!id) {
        throw new BadRequestError('no id found')
    }

    const celebrity = await Celebrity.findById(id)
     
    res.status(200).json({

    status: "success",

    celebrity

    });
    
}




module.exports = {createCelebrityProfile , getAllCelebrities , celebrity}