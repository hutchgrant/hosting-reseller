var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var User = require('../models/user');
var Auth = require('../lib/auth');

var csrfProtection = csrf();
router.use(csrfProtection);


router.get('/logout', Auth.isLoggedIn, function(req, res, next){
	req.logout();
	res.redirect('/');
});

router.use('/',  Auth.notLoggedIn, function(req, res, next) {
	next();
});

router.get('/signup', function(req, res, next){
	var messages = req.flash('error');
	res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
	failureRedirect: '/user/signup',
	failureFlash: true
}), function(req, res, next){
	if (req.session.oldUrl){
		var oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(oldUrl);
	} else{
		res.redirect('/user/profile');
	} 
});

router.get('/signin', function(req, res, next){
	var messages = req.flash('error');
	req.session.userid = null;
	res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
	failureRedirect: '/user/signin',
	failureFlash: true
}), function(req, res, next){
	if (req.session.oldUrl){
		var oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		res.redirect(oldUrl);
	} else{
		res.redirect('/dashboard');
	}
});


module.exports = router;