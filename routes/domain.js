var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Domain = require('../models/domain');
var Auth = require('../lib/auth');

var domlib = require('../lib/domlib');

router.get('/', Auth.isLoggedIn, function(req, res, next){
	res.render('dashboard/domains');
});

router.get('/list', Auth.isLoggedIn, function(req, res, next){
	domlib.findUserDomains(req, res);
});

router.get('/:id', Auth.isLoggedIn, function(req, res, next){
	domlib.findDomain(req, res);
});

router.post('/add', Auth.isLoggedIn, function(req, res, next){
	domlib.createDomain(req, res);
});

router.post('/update/:id', Auth.isLoggedIn, function(req, res, next){
	// reminder change put to post
	domlib.updateDomain(req, res);
});

router.delete('/remove/:id', Auth.isLoggedIn, function(req, res, next){
	domlib.removeDomain(req, res);
});



module.exports = router;