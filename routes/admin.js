var express = require('express');
var router = express.Router();
var csrf = require('csurf');

var Auth = require('../lib/auth');
var DOManage = require('../lib/do-manage');
var settings = require('../lib/settings');

var User = require('../models/user');
var Domain = require('../models/domain');

router.get('/', Auth.isAdmin, function(req, res, next) {
	res.render('admin/index', { layout: 'admin', title: 'Dashboard', pageCat:'dashboard'});
});

router.get('/users', Auth.isAdmin, function(req, res, next) {
	res.render('admin/users', { layout: 'admin', title: 'Users', pageCat:'manage', page:'manageUsers'});
});

router.get('/preferences', Auth.isAdmin, function(req, res, next){
	res.render('admin/preferences', { layout: 'admin', title: 'Site Preferences', pageCat:'prefs', page:'site'});
});

router.post('/preferences/submit', Auth.isAdmin, function(req, res, next){
	settings.updatePref(req, res);
});

router.get('/digitalocean', Auth.isAdmin, function(req, res, next){
	res.render('admin/DOsettings', { layout: 'admin', title: 'DigitalOcean Settings', pageCat:'prefs', page:'digitalocean'});
});

router.post('/digitalocean/submit', Auth.isAdmin, function(req, res, next){
	settings.updateAPIKey(req, res);
});

router.get('/list/:page/:limit', Auth.isAdmin, function(req, res, next) {
	var limit;
	if(parseInt(req.params.limit) <= 100){
		limit = parseInt(req.params.limit);
	}
	User.paginate({admin:false}, { page: req.params.page, limit: limit }, function(err, users) {
			if(err) {
				res.status(500).json({
					error: 'Problem getting domain list'
				});
			}
			res.json(users);
	});
});

router.get('/manage/:id', Auth.isAdmin, function(req, res, next) {
	req.session.userid = req.params.id;
	res.redirect('/dashboard/');
});

router.get('/remove/:id', Auth.isAdmin, function(req, res, next){
	Domain.remove({ user: req.params.id }, function(err, result){
		if(err){
			res.status(500).json({
		        error: 'Problem deleting domains'
		    });
		}
	});
	User.remove({_id: req.params.id }, function(err, result){
		if(err){
			res.status(500).json({
		        error: 'Problem deleting user'
		    });
		}
		res.redirect('/admin/');
	});
});

module.exports = router;