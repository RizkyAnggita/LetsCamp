const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const { validateReview } = require('../middleware');

const { isLoggedIn, isReviewAuthor } = require('../middleware');

//Controllers
const controller = require('../controllers/reviews');

//Add Review
router.post('/', isLoggedIn, validateReview, wrapAsync(controller.createReview))

//Delete Review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(controller.deleteReview))

module.exports = router;