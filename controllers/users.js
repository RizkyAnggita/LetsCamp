const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async(req, res) => {
    const {username, email, password} = req.body;
    const isExist = await User.findOne({email});
    if (isExist){
        req.flash('error', 'Email already used. Please use another email');
        res.redirect('/register');
    }
    else{
        try {
            const user = new User({username, email});
            const registeredUser = await User.register(user, password);
            req.flash('success',`Welcome to LetsCamp, ${username}!`);
            req.login(registeredUser, (err)=>{
                if(err){
                    return next(err);
                }
            });
            res.redirect('/campgrounds');
        } catch (error) {
            req.flash('error', error.message);
            res.redirect('/register');
        }
    }
    
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = async (req, res) => {
    req.flash('success', `Welcome back, ${req.body.username}`);
    if(req.session.returnTo){
        const returnUrl = req.session.returnTo;
        delete req.session.returnTo;
        return res.redirect(returnUrl);
    }
    res.redirect('/campgrounds');
}

module.exports.logoutUser = (req, res) => {
    if(req.user){
        req.logOut();
        req.flash('success', 'Bye!');
    }
    res.redirect('/campgrounds');
}