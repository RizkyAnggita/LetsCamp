const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;

const geocoder = mbxGeocoding({accessToken: mbxToken});

module.exports.index = async (req, res, next) => {
    const allCamps = await Campground.find({});
    res.render('campgrounds/index', {campgrounds: allCamps});
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid Campground Data on the Form', 400);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id;
    campground.geometry = geoData.body.features[0].geometry

    await campground.save();
    console.log(campground);
    req.flash('success', "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`)   
}

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    
    if(campground){
        res.render('campgrounds/show', {campground});
    }
    else{
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(campground){
        res.render('campgrounds/edit', {campground});
    }
    else{
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators: true, new: true});
    campground.images.push(...req.files.map(f => ({url: f.path, filename: f.filename})))
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    await campground.save()
    req.flash('success', "Successfully updated the campground!");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${camp.title} !`);
    res.redirect('/campgrounds');
}