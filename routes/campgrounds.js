const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync')

const multer  = require('multer')
const { storage } = require('../cloudinary');
const upload = multer({ storage })

//Controllers
const controller = require('../controllers/campgrounds');

//Middleware
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router.route('/')
    .get(wrapAsync(controller.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, wrapAsync(controller.createCampground));
    // .post(upload.array('image'), (req, res) => {
    //     console.log(req.body, req.files);
    //     res.send("IT WORKED");
    // })
router.get('/new', isLoggedIn, controller.renderNewForm)

router.route('/:id')
    .get(wrapAsync(controller.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, wrapAsync(controller.updateCampground))
    .delete(isLoggedIn, isAuthor, wrapAsync(controller.deleteCampground));


router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(controller.renderEditForm));

module.exports = router;