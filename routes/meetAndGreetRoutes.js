const express = require('express')
const router = express.Router()
const upload = require('../middleware/Upload.js')
//const auth = require('../middleware/Authenthication.js')

const {
 createMeetAndGreet,
 getAllMeetAndGreets,
 getSingleMeetAndGreet,
 updateMeetAndGreet,
 deleteMeetAndGreet,
 getCelebMeetAndGreet
} = require('../controllers/meetAndGreetController.js')


router.route("/")
    .post(
        upload.array("images"),
        createMeetAndGreet
    )
    .get(getAllMeetAndGreets);


router.route("/:id")
    .patch(
        
        upload.array("images"),
        updateMeetAndGreet
    )
    .delete(deleteMeetAndGreet);

router.get("/get/:id" , getSingleMeetAndGreet)
router.get("/getAll/:id" , getCelebMeetAndGreet)

module.exports = router;