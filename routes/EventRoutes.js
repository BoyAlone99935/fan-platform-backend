const express = require('express')
const router = express.Router()
const upload = require('../middleware/Upload.js')
const {
    createEvent,
    createTickeType,
    updateEvent,
    updateTicketType,
    deleteEvent,
    deleteTicketType,
    getAllEvents,
    getEvent,
    getCelebrityEvents
} = require('../controllers/eventController.js')

//const auth = require('../middleware/Authenthication.js')



router.route("/create-event")
    .post(upload.fields([
        { name: "bannerImage", maxCount: 1 },
        { name: "arenaOverview", maxCount: 1 },
        {name : "ticketImages" , maxCount : 20}
    ]), createEvent)
    .get(getAllEvents);

router.route("/:id")
    .get(getEvent)
    .patch(upload.fields([
        { name: "bannerImage", maxCount: 1 },
        { name: "arenaOverview", maxCount: 1 }
    ]) , updateEvent)
    .delete(deleteEvent);


router.post(
    "/:id/ticket-types",
    upload.single("image"),
    createTickeType
);

router.get("/getEvents/:id" , getCelebrityEvents)

router.delete(
    "/:eventId/ticket-types/:ticketTypeId",
    deleteTicketType
);

/*router.patch(
    "/:eventId/ticket-types/:ticketTypeId",
    updateTicketType
);*/




module.exports = router;