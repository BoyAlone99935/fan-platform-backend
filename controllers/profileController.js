const Celebrity = require('../models/Celebrity')
const  {StatusCodes} =  require('http-status-codes')
const BadRequestError = require('../errors/BadRequestError')
const NotFoundError = require('../errors/NotFoundEror')
const  { lookupArtistMBID } = require('../utils/MusicBrainz')
const {extractYouTubeId} = require('../utils/Youtbue')
/*const createCelebrityProfile = async (req , res) => {
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

      
};*/




const createCelebrityProfile = async (req, res) => {
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
 
    // best-effort lookup — does NOT block celebrity creation if it fails
    // or finds no confident match. mbid just stays null and gets picked
    // up later (e.g. via a manual admin edit, or a retry endpoint).
    const mbid = await lookupArtistMBID(name);
 
    const celebrity = await Celebrity.create({
 
        name,
 
        slug,
 
        bio,
 
        category,
 
        profileImage,
 
        coverImage,
 
        mbid,
 
        socialLinks: {
 
            instagram,
 
            twitter,
 
            youtube
 
        }
 
    });
 
 
    res.status(StatusCodes.CREATED).json({
        message: "celebrity created",
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


const getCelebrityBySlug = async (req , res) => {
    const {slug} = req.params

    if (!slug) {
        throw new BadRequestError("no slug present in this request")
    }

    const celebrity = await Celebrity.findOne({slug})

    if (!celebrity) {
        throw new NotFoundError("celebrity not found")
    }

    res.status(StatusCodes.OK).json({
        status : "success",
        message : "celebrity found",
        celebrity
    })
}




const addPerformanceVideo = async (req, res) => {
    const { id } = req.params;
    const { title, url, venue, date } = req.body;
 
    if (!title || !url) {
        throw new BadRequestError("Please provide a title and a YouTube URL");
    }
 
    const youtubeId = extractYouTubeId(url);
 
    if (!youtubeId) {
        throw new BadRequestError("Could not extract a valid YouTube video ID from that URL");
    }
 
    const celebrity = await Celebrity.findById(id);
 
    if (!celebrity) {
        throw new NotFoundError("celebrity not found");
    }
 
    celebrity.performanceVideos.push({
        title,
        youtubeId,
        venue: venue || "",
        date: date || undefined
    });
 
    await celebrity.save();
 
    res.status(StatusCodes.CREATED).json({
        status: "success",
        performanceVideos: celebrity.performanceVideos
    });
};
 
const removePerformanceVideo = async (req, res) => {
    const { id, videoId } = req.params;
 
    const celebrity = await Celebrity.findById(id);
 
    if (!celebrity) {
        throw new NotFoundError("celebrity not found");
    }
 
    celebrity.performanceVideos.pull(videoId);
 
    await celebrity.save();
 
    res.status(StatusCodes.OK).json({
        status: "success",
        message: "video removed",
        performanceVideos: celebrity.performanceVideos
    });
};




module.exports = {createCelebrityProfile , getAllCelebrities , celebrity , getCelebrityBySlug , addPerformanceVideo , removePerformanceVideo}