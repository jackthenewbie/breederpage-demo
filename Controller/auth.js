const { Client, Account, ID } = require('node-appwrite');
require('dotenv').config();
const client = new Client()
    .setEndpoint(process.env.endPoint) 
    .setProject(process.env.PROJECT_ID); 

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
        const session = await account.createEmailPasswordSession(email, password);

        // Store session/token data as needed
        req.session.user = session;
        req.session.isLoggedIn = true;
        await req.session.save();

        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
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
    res.render('authentication/signup', {
        pageTitle: "Login | Taste On Wheels",
        message: req.flash('error')[0] || null,
        className: req.flash('className'),
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
}
exports.postSignUp = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
        req.flash('error', 'Account created successfully');
        req.flash('className', 'successFlash');

        res.redirect('/login');
    } catch (error) {
        req.flash('className', 'errorFlash');
        let errorMessage = '';
        try {errorMessage=JSON.parse(error.response).message;}catch(e){}
        console.log(errorMessage);
        res.render('authentication/signup', {
            pageTitle: "Sign Up | Taste On Wheels",
            message: errorMessage,
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
