var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var User = require('../models/user');
var Domain = require('../models/domain');
var Auth = require('../lib/auth');

var dom = require('./domain');
var host = require('./hosting');

router.use('/domain', dom);
router.use('/hosting', host);

router.get('/', Auth.isLoggedIn, function(req, res, next){
	Domain.find({ user: req.user}, function(err, domains){
		if(err) {
			return res.write('Error!');
		}
		res.render('dashboard/index', {domains: domains});
	});
});



module.exports = router;