const Celebrity = require('../models/Celebrity')
const { StatusCodes } = require('http-status-codes')
const BadRequestError = require('../errors/BadRequestError')
const NotFoundError = require('../errors/NotFoundEror')

// converts setlist.fm's "DD-MM-YYYY" eventDate into a real ISO date
const parseSetlistDate = (eventDate) => {
    if (!eventDate) return null;
    const [day, month, year] = eventDate.split("-");
    return new Date(`${year}-${month}-${day}`).toISOString();
};

const getSetlistsByCelebrity = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new BadRequestError("celebrity id not present in request");
    }

    const celebrity = await Celebrity.findById(id);

    if (!celebrity) {
        throw new NotFoundError("celebrity not found");
    }

    // no confident MusicBrainz match was found for this celebrity yet —
    // not an error, just nothing to show
    if (!celebrity.mbid) {
        return res.status(StatusCodes.OK).json({
            status: "success",
            message: "No linked artist found for setlists",
            setlists: []
        });
    }

    const page = req.query.page || 1;

    const response = await fetch(
        `https://api.setlist.fm/rest/1.0/artist/${celebrity.mbid}/setlists?p=${page}`,
        {
            headers: {
                "x-api-key": process.env.SETLISTFM_API_KEY,
                Accept: "application/json"
            }
        }
    );

    // setlist.fm returns 404 when the artist genuinely has no setlists —
    // treat that as an empty result, not a server error
    if (response.status === 404) {
        return res.status(StatusCodes.OK).json({
            status: "success",
            setlists: []
        });
    }

    if (!response.ok) {
        console.error(`setlist.fm request failed: ${response.status}`);
        return res.status(StatusCodes.OK).json({
            status: "success",
            message: "Setlist data temporarily unavailable",
            setlists: []
        });
    }

    const data = await response.json();

    const setlists = (data.setlist || []).map((entry) => ({
        id: entry.id,
        date: parseSetlistDate(entry.eventDate),
        venue: entry.venue?.name || "",
        city: entry.venue?.city?.name || "",
        country: entry.venue?.city?.country?.name || "",
        tour: entry.tour?.name || null,
        songs: (entry.sets?.set || [])
            .flatMap((set) => set.song || [])
            .map((song) => song.name),
        url: entry.url
    }));

    res.status(StatusCodes.OK).json({
        status: "success",
        page: Number(data.page) || 1,
        itemsPerPage: Number(data.itemsPerPage) || setlists.length,
        total: Number(data.total) || setlists.length,
        setlists
    });
};

module.exports = { getSetlistsByCelebrity }