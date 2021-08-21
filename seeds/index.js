const mongoose = require('mongoose');
const Campground = require('../models/campground');
const Review = require('../models/review');

const cities = require('./cities');
const {places, descriptors} = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/letsCamp', 
{useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true})
    // .then(() => {
    //     console.log('Mongo Connection open!');
    // })
    // .catch((e) => {
    //     console.log("Something error Mongo! ", e);
    // })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 9;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                url: 'https://res.cloudinary.com/rizkyanggitasiregar/image/upload/v1629122544/LetsCamp/mountain_1_cp9ah5.jpg',
                filename: 'LetsCamp/o90ulx3pefazpexxr1ae'
              },
              {
                url: 'https://res.cloudinary.com/rizkyanggitasiregar/image/upload/v1629122543/LetsCamp/river_1_wcsmsd.jpg',
                filename: 'LetsCamp/nu4sps3inw2uq6lnldd1'
              }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea, minus quasi. Quos esse eum consectetur quia maxime tempore expedita. Ullam rem dignissimos architecto inventore cupiditate quis cumque ipsum hic excepturi.',
            price: price,
            author: '610ea3cb7a6bf705c4d28636',
            geometry: { 
                type: 'Point', 
                coordinates: [ 
                    cities[random1000].longitude, 
                    cities[random1000].latitude 
                ]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})