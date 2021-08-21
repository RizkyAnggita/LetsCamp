const Campground = require('./models/campground');
const Review = require('./models/review');

const { campgroundValidationSchema, reviewValidationSchema } = require('./validationSchema');
const ExpressError = require('./utils/ExpressError');

const isLoggedIn = (req, res, next ) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You are not signed in!');
        return res.redirect('/login');
    }
    else{
        next()
    }
}

const validateCampground = (req, res, next) => {
    const { error } = campgroundValidationSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

const isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if(!camp.author.equals(req.user._id)){
        req.flash('error', 'You don\'t have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

const validateReview = (req, res, next) => {
    const { error } = reviewValidationSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You don\'t have permission to do that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isLoggedIn = isLoggedIn;
module.exports.isAuthor = isAuthor;
module.exports.validateCampground = validateCampground;
module.exports.validateReview = validateReview;
module.exports.isReviewAuthor = isReviewAuthor;