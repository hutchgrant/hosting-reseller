var express = require('express');
var router = express.Router();

var Auth = require('../lib/auth');
var hostlib = require('../lib/hostlib');


router.init = function(config){
	hostlib.init(config);
}

router.get('/', Auth.isLoggedIn, function(req, res, next){
	res.render('dashboard/hosts');
});

router.get('/new', Auth.isLoggedIn, function(req, res, next){
	res.render('hosting/add');
});

router.post('/add', Auth.isLoggedIn, function(req, res, next){
	hostlib.createDroplet(req, res);
});

router.get('/manage/:id', Auth.isLoggedIn, function(req, res, next){
	hostlib.manageDroplet(req, res, next);
});

router.get('/api', Auth.isLoggedIn, function(req, res, next){
	hostlib.getAllAvail(req, res);
});

router.get('/list/:page/:limit', Auth.isLoggedIn, function(req, res, next) {
	hostlib.getUserDroplets(req, res);
});

router.get('/:id', Auth.isLoggedIn, function(req, res, next){
	hostlib.getSingleDroplet(req, res);
});

router.post('/update/:id', Auth.isLoggedIn, function(req, res, next){
	/// TODO: add update 
});

router.delete('/remove/:id', Auth.isLoggedIn, function(req, res, next){
	hostlib.removeDroplet(req, res);
});

module.exports = router;