const {Client, Databases} = require('node-appwrite');
require('dotenv').config();
const client = new Client()
    .setEndpoint(process.env.endPoint)// Replace with your endpoint
    .setProject(process.env.PROJECT_ID);
const databases = new Databases(client);
const { validationResult } = require('express-validator');

// exports.getHomePage = (req, res, next) => {
//     console.log('Welcome to home page');
//     FoodTruck.find()
//         .then(truck => {




//             return res.render('index', {
//                 pageTitle: "Taste On Wheels",
//                 truck: truck,
//                 topRatedTrucks:[]
//             })
//         })
// }

exports.getHomePage= async (req, res, next)=>{
    console.log('Welcome to home page');
    await databases.listDocuments(process.env.DATABASE_ID,process.env.DOG_COLLECTION_ID)
        .then(results => {
            const trucks = results.documents;
            const bogoTrucks = trucks.filter(truck => truck.bogoOn && truck.bogoOn.length > 0);


            const sortedByRating = trucks.slice().sort((a, b) => b.rating - a.rating);


            const topRatedTrucks = sortedByRating.slice(0, Math.min(sortedByRating.length, 10));


            const sortedByDiscount = trucks.slice().sort((a, b) => b.discountToday - a.discountToday);


            const topDiscountedTrucks = sortedByDiscount.slice(0, Math.min(sortedByDiscount.length, 10));

            return res.render('index', {
                pageTitle: "Taste On Wheels",
                truck: trucks,
                bogoTrucks: bogoTrucks,
                topRatedTrucks: topRatedTrucks,
                topDiscountedTrucks: topDiscountedTrucks
            });
        })
        .catch(err => {
            console.error('Error fetching food trucks:', err);

            next(err);
        });
    }
exports.getDog = (req, res, next) => {
    const dogId = req.params.dogId;
    dogs.findById(dogId)
        .then(dog => {
            return res.render('foodtruck', {
                pageTitle: "Taste On Wheels",
                truck:dog
            })
        })
        .catch(err => {
            console.log('Truck Id Wrong, Truck not found');
            return res.redirect('/');
        })
}

exports.getAbout = (req, res, next) => {
    return res.render('about', {
        pageTitle: "About",
    })
}
exports.postSearch = (req, res, next) => {
    const search = req.body.search;
    if (search === '') {
        return res.render('search', {
            pageTitle: `Search ${search}`,
            url: '/search',
            truck: [],
            message: "Search field can't be empty, search for food trucks, dishes, cusines",
            search: ''
        })
    }

    return res.redirect(`/search/${search}`);
}

exports.getSearch = (req, res, next) => {
    const search = req.params.searchedText;
    dogs.find(
        {
            $or: [
                {
                    name: {
                        $regex: '\\b' + search + '\\b', $options: "i",
                    }
                },
                {
                    address: {
                        $regex: '\\b' + search + '\\b', $options: "i",
                    }
                },
                {
                    description: {
                        $regex: '\\b' + search + '\\b', $options: "i",
                    }
                },
                {
                    cusinesOffered: {
                        $regex: '\\b' + search + '\\b', $options: "i",
                    }
                },
                {
                    "threeSpecialDishes.dish": { $regex: '\\b' + search + '\\b', $options: "i" }
                }
            ],

        }).then(dog => {
            console.log(dog);
            return res.render('search', {
                pageTitle: `Search ${search}`,
                url: '/search',
                truck: dog,
                message: `Search Results for ${search} `,
                search: search
            });
        }).catch(err => {
            return res.render('search', {
                pageTitle: `Search ${search}`,
                url: '/search',
                truck: [],
                message: `Sorry, No results found for ${search}`,
                search: search

            })
        })
}
