const express = require('express')
const {createCelebrityProfile , celebrity , getAllCelebrities , getCelebrityBySlug} = require('../controllers/profileController.js')
const router = express.Router()
const upload = require('../middleware/Upload.js')




router.post('/create-celebrity' , 
    upload.fields([

      {
         name: "profileImage",
         maxCount: 1
      },

      {
         name: "coverImage",
         maxCount: 1
      }

   ]),

    createCelebrityProfile
)




/*router.patch('/:id' , 
    upload.fields([

      {
         name: "profileImage",
         maxCount: 1
      },

      {
         name: "coverImage",
         maxCount: 1
      }

   ]),

    updateCelebrityProfile
)*/

router.get("/:slug", getCelebrityBySlug);

router.get('/' , getAllCelebrities)

router.get('/:id' , celebrity)


module.exports = router