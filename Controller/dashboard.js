const Dog = require('../Model/dog')
const { validationResult } = require('express-validator');
const {Client, Databases, Account, Query} = require('node-appwrite');
require('dotenv').config();
const client = new Client()
    .setEndpoint(process.env.endPoint)// Replace with your endpoint
    .setProject(process.env.PROJECT_ID);
const databases = new Databases(client);

exports.getDashboard = async (req, res, next) => {
    // const authHeader = req.headers.authorization;

    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // return res.status(401).json({ error: 'No token provided' });
    // }

    // const token = authHeader.split(' ')[1];
    // client.setJWT(token)
    const session = req.cookies.session;

    // If the session cookie is not present, return an error
    if (!session) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Pass the session cookie to the Appwrite client
    client.setSession(session);
    console.log('req.session.isLoggedIn:', req.session.isLoggedIn)
    // Now, you can make authenticated requests to the Appwrite API
    const account = new Account(client);
    const user = await account.get();
    console.log(user.$id);
    const request = 
    await databases.listDocuments(process.env.DATABASE_ID,
                                process.env.DOG_COLLECTION_ID,
                                [Query.equal('breederId',user.$id)])
        .then(dog => {
            return res.render('dashboard/dashboard', {
                pageTitle: 'myTruck',
                url: '/dashboard',
                truck:[],
            })
        })
}
function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) {
    age--;
  }

  return age;
}

exports.getAddFoodTruck = (req, res, next) => {

    let className = req.flash('className');
    res.render('dashboard/addFoodTruck', {
        pageTitle: 'Dashboard',
        url: '/addFoodTruck',
        name:'',
        breed:'',
        birthday:'',
        characteristics:'',
        images:'',
        videos:''
    })
}

exports.postAddFoodTruck = (req, res, next) => {
    const errors = validationResult(req);
    const userId = req.session.user._id;

    console.log(req.body);
    const name = req.body.name;
    const birthday = req.body.birthday;
    const breed = req.body.breed;
    const age = calculateAge(req.body.birthday);
    const characteristics = req.body.characteristics;
    const images = req.body.images;
    const videos = req.body.videos;

    if (!errors.isEmpty()) {
        let className = 'errorFlash'
        return res.render('dashboard/addFoodTruck', {
            message: errors.array()[0].msg,
            className: className,
            pageTitle: 'Dashboard',
            url: '/addFoodTruck',
            truckId: '',
            name: name,
            birthday: birthday,
            breed: breed,
            age:age,
            characteristics:characteristics,
            images: images,
            videos:videos,        
        })
    } else {
        const dog = new Dog({
            userId: userId,
            name: name,
            birthday: birthday,
            breed: breed,
            age:age,
            characteristics:characteristics,
            images: images,
            videos:videos, 
            // images: [
            //     {
            //         mainImage: imageUrl,
            //     }
            // ],
        })


        dog.save()
            .then(result => {
                console.log(result);
                let dogId = result._id.toString()
                console.log(dogId)
                return res.redirect(`/myTrucks`)
            })
            .catch(result => {
                console.log(result);
                req.flash('error', 'Sorry, some database error occured');
                req.flash('className', 'errorFlash');
                return res.redirect(`/addFoodTruck`)

            })
    }
}


exports.postTruckImages = (req, res, next) => {

}

exports.getMyTrucks = (req, res, next) => {
    const userId = req.session.user._id;

    Dog.find({ userId: userId })
        .then(truck => {
            // console.log(truck);
            return res.render('dashboard/myTrucks', {
                pageTitle: 'myTruck',
                url: '/myTrucks',
                truck: truck
            })
        })
}

exports.getAllTrucks = (req, res, next) => {

    const accountType = req.session.user.userType;
    if(accountType==='admin'){
        FoodTruck.find()
        .then(truck => {
            // console.log(truck);
            return res.render('dashboard/myTrucks', {
                pageTitle: 'myTruck',
                url: '/allTrucks',
                truck: truck
            })
        })
    }else{
        return(res.redirect('/'));
    }
}

exports.getEditMyTruck = (req, res, next) => {
    const truckId = req.params.truckId;
    console.log(truckId)

    FoodTruck.findById(truckId)
        .then(truck => {
            console.log('Truck to be edited', truck);
            res.render('dashboard/addFoodTruck', {
                pageTitle: 'Edit Food Truck',
                url: '/editFoodTruck',
                truckId: truck._id,
                message: '',
                className: '',
                name: truck.name,
                address: truck.address,
                priceForTwo: truck.priceForTwo,
                mondayStatus: truck.openingHours[0].open,
                tuesdayStatus: truck.openingHours[1].open,
                wednesdayStatus: truck.openingHours[2].open,
                thursdayStatus: truck.openingHours[3].open,
                fridayStatus: truck.openingHours[4].open,
                saturdayStatus: truck.openingHours[5].open,
                sundayStatus: truck.openingHours[6].open,
                openingTimeMonday: truck.openingHours[0].openingTime,
                closingTimeMonday: truck.openingHours[0].openingTime,
                openingTimeTuesday: truck.openingHours[1].openingTime,
                closingTimeTuesday: truck.openingHours[1].openingTime,
                openingTimeWednesday: truck.openingHours[2].openingTime,
                closingTimeWednesday: truck.openingHours[2].openingTime,
                openingTimeThursday: truck.openingHours[3].openingTime,
                closingTimeThursday: truck.openingHours[3].openingTime,
                openingTimeFriday: truck.openingHours[4].openingTime,
                closingTimeFriday: truck.openingHours[4].openingTime,
                openingTimeSaturday: truck.openingHours[5].openingTime,
                closingTimeSaturday: truck.openingHours[5].openingTime,
                openingTimeSunday: truck.openingHours[6].openingTime,
                closingTimeSunday: truck.openingHours[6].openingTime,
                cusinesOffered: truck.cusinesOffered,
                specialDishOne: truck.threeSpecialDishes[0].dish,
                specialDishTwo: truck.threeSpecialDishes[1].dish,
                specialDishThree: truck.threeSpecialDishes[2].dish,
                famousFor: truck.famousFor,
                description: truck.description,
                year: truck.servingSince,
                discountToday: truck.discountToday,
                customDiscount1: truck.customDiscount1,
                customDiscount2: truck.customDiscount2,
                customDiscount3: truck.customDiscount3,
                email: truck.email,
                contactNumbers: truck.contactNumbers,
                bogoOn: truck.bogoOn,
                website: truck.website,
                imageUrl: truck.images[0].mainImage

            })
        })
        .catch(err => {
            console.log(err);
            console.log('Truck not found on get my truck');
            return res.redirect('/myTrucks')
        })

}
exports.postEditMyTruck = (req, res, next) => {

    console.log("Request Body:", req.body);

    const truckId = req.body.truckId;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        let className = 'errorFlash'
        return res.render('dashboard/addFoodTruck', {
            message: errors.array()[0].msg,
            className: className,
            pageTitle: 'Edit Food Truck',
            url: '/editFoodTruck',
            truckId: truckId,
            name: req.body.name,
            address: req.body.address,
            priceForTwo: req.body.priceForTwo,
            mondayStatus: req.body.mondayStatus,
            tuesdayStatus: req.body.tuesdayStatus,
            wednesdayStatus: req.body.wednesdayStatus,
            thursdayStatus: req.body.thursdayStatus,
            fridayStatus: req.body.fridayStatus,
            saturdayStatus: req.body.saturdayStatus,
            sundayStatus: req.body.saturdayStatus,
            openingTimeMonday: req.body.openingTimeMonday,
            closingTimeMonday: req.body.closingTimeMonday,
            openingTimeTuesday: req.body.openingTimeTuesday,
            closingTimeTuesday: req.body.closingTimeTuesday,
            openingTimeWednesday: req.body.openingTimeWednesday,
            closingTimeWednesday: req.body.closingTimeWednesday,
            openingTimeThursday: req.body.openingTimeThursday,
            closingTimeThursday: req.body.closingTimeThursday,
            openingTimeFriday: req.body.openingTimeFriday,
            closingTimeFriday: req.body.closingTimeFriday,
            openingTimeSaturday: req.body.openingTimeSaturday,
            closingTimeSaturday: req.body.closingTimeSaturday,
            openingTimeSunday: req.body.openingTimeSunday,
            closingTimeSunday: req.body.closingTimeSunday,
            cusinesOffered: req.body.cusinesOffered,
            specialDishOne: req.body.specialDishOne,
            specialDishTwo: req.body.specialDishTwo,
            specialDishThree: req.body.specialDishThree,
            famousFor: req.body.famousFor,
            description: req.body.description,
            year: req.body.year,
            discountToday: req.body.discountToday,
            customDiscount1: req.body.customDiscount1,
            customDiscount2: req.body.customDiscount2,
            customDiscount3: req.body.customDiscount3,
            email: req.body.email,
            contactNumbers: req.body.contactNumbers,
            bogoOn: req.body.bogoOn,
            website: req.body.website,
            imageUrl: req.body.imageUrl
        })
    }

    // console.log('Here is the body', req.body);
    FoodTruck.findById(truckId)
        .then(truck => {
            console.log('Truck Found', truck)
            truck.name = req.body.name;
            truck.address = req.body.address;
            truck.priceForTwo = req.body.priceForTwo;
            let imagesArray = [
                {
                    mainImage: req.body.imageUrl,
                    menu: [],
                    gallery: [],
                    specialThreeDishes: []
                }
            ]

            truck.images = imagesArray;
            let openingHours = [
                {
                    day: 'Monday',
                    open: req.body.MondayStatus,
                    openingTime: req.body.openingTimeMonday,
                    closingTime: req.body.closingTimeMonday
                },
                {
                    day: 'Tuesday',
                    open: req.body.TuesdayStatus,
                    openingTime: req.body.openingTimeTuesday,
                    closingTime: req.body.closingTimeTuesday
                },
                {
                    day: 'Wednesday',
                    open: req.body.WednesdayStatus,
                    openingTime: req.body.openingTimeWednesday,
                    closingTime: req.body.closingTimeWednesday
                },
                {
                    day: 'Thursday',
                    open: req.body.ThursdayStatus,
                    openingTime: req.body.openingTimeThursday,
                    closingTime: req.body.closingTimeThursday
                },
                {
                    day: 'Friday',
                    open: req.body.FridayStatus,
                    openingTime: req.body.openingTimeFriday,
                    closingTime: req.body.closingTimeFriday
                },
                {
                    day: 'Saturday',
                    open: req.body.SaturdayStatus,
                    openingTime: req.body.openingTimeSaturday,
                    closingTime: req.body.closingTimeSaturday
                },
                {
                    day: 'Sunday',
                    open: req.body.SundayStatus,
                    openingTime: req.body.openingTimeSunday,
                    closingTime: req.body.closingTimeSunday
                }]
            truck.openingHours = openingHours;
            truck.cusinesOffered = req.body.cusinesOffered;

            truck.specialDishOne = req.body.specialDishOne;
            truck.specialDishTwo = req.body.specialDishTwo;
            truck.specialDishThree = req.body.specialDishThree;

            truck.famousFor = req.body.famousFor;
            truck.description = req.body.description;
            truck.year = req.body.year;
            truck.discountToday = req.body.discountToday;

            truck.customDiscount1 = req.body.customDiscount1;
            truck.customDiscount2 = req.body.customDiscount2;
            truck.customDiscount3 = req.body.customDiscount3;

            truck.email = req.body.email;
            truck.contactNumbers = req.body.contactNumbers;

            truck.bogoOn = req.body.bogoOn;
            truck.website = req.body.website;
            truck.save().then(result => {
                return res.redirect('/myTrucks');
            })
                .catch(err => {
                    console.log(err);
                    return res.redirect('/myTrucks')
                });
        })


    //     FoodTruck.findById(truckId)
    //         .then(truck => {
    //          
    //             let imagesArray = [
    //                 {
    //                     mainImage: imageUrl,
    //                     menu: [],
    //                     gallery: [],
    //                     specialThreeDishes: []
    //                 }
    //             ]
    //             truck.images = imagesArray;

    //             console.log('req.body.MondayStatus', req.body.MondayStatus)
    //             truck.openingHours[0].open = req.body.MondayStatus;
    //             truck.openingHours[1].open = req.body.TuesdayStatus;
    //             truck.openingHours[2].open = req.body.WednesdayStatus;
    //             truck.openingHours[3].open = req.body.ThursdayStatus;
    //             truck.openingHours[4].open = req.body.FridayStatus;
    //             truck.openingHours[5].open = req.body.SaturdayStatus;
    //             truck.openingHours[6].open = req.body.SundayStatus;

    //             truck.openingHours[0].openingTime = req.body.openingTimeMonday;
    //             truck.openingHours[0].closingTime = req.body.closingTimeMonday;

    //             truck.openingHours[1].openingTime = req.body.openingTimeTuesday;
    //             truck.openingHours[1].closingTime = req.body.closingTimeTuesday;

    //             truck.openingHours[2].openingTime = req.body.openingTimeWednesday;
    //             truck.openingHours[2].closingTime = req.body.closingTimeWednesday;

    //             truck.openingHours[3].openingTime = req.body.openingTimeThursday;
    //             truck.openingHours[3].closingTime = req.body.closingTimeThursday;

    //             truck.openingHours[4].openingTime = req.body.openingTimeFriday;
    //             truck.openingHours[4].closingTime = req.body.closingTimeFriday;

    //             truck.openingHours[5].openingTime = req.body.openingTimeSaturday;
    //             truck.openingHours[5].closingTime = req.body.closingTimeSaturday;

    //             truck.openingHours[6].openingTime = req.body.openingTimeSunday;
    //             truck.openingHours[6].closingTime = req.body.closingTimeSunday;

    //             truck.cusinesOffered = req.body.cusinesOffered;

    //             truck.specialDishOne = req.body.specialDishOne;
    //             truck.specialDishTwo = req.body.specialDishTwo;
    //             truck.specialDishThree = req.body.specialDishThree;

    //             truck.famousFor = req.body.famousFor;
    //             truck.description = req.body.description;
    //             truck.year = req.body.year;
    //             truck.discountToday = req.body.discountToday;

    //             truck.customDiscount1 = req.body.customDiscount1;
    //             truck.customDiscount2 = req.body.customDiscount2;
    //             truck.customDiscount3 = req.body.customDiscount3;

    //             truck.email = req.body.email;
    //             truck.contactNumbers = req.body.contactNumbers;

    //             truck.bogoOn = req.body.bogoOn;
    //             truck.website = req.body.website;


    //             truck.save()
    //                 .then(result => {
    //                     console.log('Updated Truck', result);
    //                     return res.redirect('/myTrucks');
    //                 }).catch(err => {
    //                     // console.log(err);
    //                     console.log('Truck found but could not be updated');
    //                     return res.redirect('/myTrucks');
    //                 })
    //         })
    //         .catch(err => {
    //             // console.log(err);
    //             console.log('Truck could not be found for editing');
    //             return res.redirect('/myTrucks')
    //         })
}


exports.deleteTruck = (req, res, next) => {
    const truckId = req.body.truckId;
    FoodTruck.findByIdAndDelete(truckId)
        .then(result => {
            return res.redirect('/myTrucks');
        })
}