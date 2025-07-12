const { Client, Account, ID } = require('node-appwrite');
require('dotenv').config();
const client = new Client()
    .setEndpoint(process.env.endPoint) // Replace with your endpoint
    .setProject(process.env.PROJECT_ID); // Replace with your project ID

const account = new Account(client);
exports.getLogin = (req, res, next) => {
    // Render stays the same
    res.render('authentication/login', {
        pageTitle: "Login | Taste On Wheels",
        message: req.flash('error')[0] || null,
        className: req.flash('className'),
        email: ''
    });
};
exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const session = await account.createEmailSession(email, password);

        // Store session/token data as needed
        req.session.user = session;
        req.session.isLoggedIn = true;
        await req.session.save();

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
        req.flash('error', 'Incorrect Email or Password');
        req.flash('className', 'errorFlash');
        res.render('authentication/login', {
            pageTitle: "Login | Taste On Wheels",
            message: 'Incorrect Email or Password',
            className: 'errorFlash',
            email: req.body.email
        });
    }
};
exports.getSignUp = (req, res, next) => {
    // Render stays the same
    res.render('authentication/login', {
        pageTitle: "Login | Taste On Wheels",
        message: req.flash('error')[0] || null,
        className: req.flash('className'),
        email: ''
    });
};
exports.postSignUp = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // 1. Create Appwrite account
        await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);

        // 2. Flash success message
        req.flash('error', 'Account created successfully');
        req.flash('className', 'successFlash');

        res.redirect('/login');
    } catch (error) {
        console.log(error);

        req.flash('error', 'Account with this email already exists');
        req.flash('className', 'errorFlash');
        res.render('authentication/signup', {
            pageTitle: "Sign Up | Taste On Wheels",
            message: 'Account with this email already exists',
            className: 'errorFlash',
            firstName,
            lastName,
            email,
            password
        });
    }
};
exports.postLogOut = async (req, res, next) => {
    try {
        await account.deleteSession('current');
        req.session.destroy(() => res.redirect('/'));
        console.log("Logged Out");
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
};
