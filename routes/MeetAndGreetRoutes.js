const express = require('express')
const router = express.Router()
const upload = require('../middleware/Upload.js')
//const auth = require('../middleware/Authenthication.js')

const {
 createMeetAndGreet,
 getAllMeetAndGreets,
 getSingleMeetAndGreet,
 updateMeetAndGreet,
 deleteMeetAndGreet
} = require('../controllers/meetAndGreetController')


router.route("/")
    .post(
        upload.array("images"),
        createMeetAndGreet
    )
    .get(getAllMeetAndGreets);


router.route("/:id")
    .get(getSingleMeetAndGreet)
    .patch(
        
        upload.array("images"),
        updateMeetAndGreet
    )
    .delete(deleteMeetAndGreet);



module.exports = router;