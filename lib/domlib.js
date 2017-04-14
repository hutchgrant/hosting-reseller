var Domain = require('../models/domain');
var moment = require('moment');

/*
* Create new Domain
*
* @param {Object} req Request
* @param {Object} res Response
* @return redirect
*/
exports.createDomain = function(req, res){
    req.checkBody('url', 'Invalid Url').notEmpty().isLength({min:10, max:75});
	req.checkBody('expiration', 'Invalid Expiry Date').notEmpty();
	var errors = req.validationErrors();
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		req.flash('error', messages);
		res.redirect('/dashboard/domain');
	}
	var domain = new Domain({
		user: req.user,
		url: req.body.url,
		created: moment(),
		expiration: req.body.expiration
	});
	domain.save().then(function(result){
		res.redirect('/dashboard/domain');
	})
	.catch(function(err){
		res.status(500).json({error: 'Problem adding domain'});
	});
}

/*
* Update Domain
*
* @param {Object} req Request
* @param {Object} res Response
* @return JSON object domain
*/
exports.updateDomain = function(req, res){
    req.checkBody('url', 'Invalid Url').isLength({min:10, max:75});
	req.checkBody('expiration', 'Invalid Expiry Date').notEmpty();
	var errors = req.validationErrors();
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		res.status(500).json({
		    error: messages
		});	
		return null;
	}

	var upDom = Domain.findOneAndUpdate({_id:req.params.id, user:req.user}, {$set:{expiration:req.body.expiration, url:req.body.url}}).exec();
	upDom.then(function(updatedDomain){
		res.status(200).json(updatedDomain);
	})
	.catch(function(err){
        res.status(500).json({error:"domain doesn't exist"});
	});
}

/*
* Update Domain
*
* @param {Object} req Request
* @param {Object} res Response
* @return JSON status success/error
*/
exports.removeDomain = function(req, res){
	Domain.remove({_id: req.params.id, user: req.user}).exec().then(function(result){
		res.status(200).json({success:"Domain removed"});
	}).catch(function(err){
		res.status(500).json({error: "Couldn't remove domain"});		
	});
}


/*
* Find all domains for a specific user
*
* @param {Object} req Request
* @param {Object} res Response
* @return Array Domains
*/
exports.findUserDomains = function(req, res){
	Domain.find({user: req.user}).exec().then(function(domains){
		var domCopies = [];
		for(dom in domains){
			domCopies.push(formatDomainDate(domains[dom]));
		}
        res.status(200).json(domCopies);
	})
	.catch(function(err){
        res.status(500).json({error: "couldn't retrieve domains"});
	})
}

/*
* Query specific domain
*
* @param {Object} req Request
* @param {Object} res Response
* @return Object Domains
*/
exports.findDomain = function(req, res){
    Domain.findOne({_id:req.params.id,user: req.user}).then(function(domain){
        res.status(200).json(formatDomainDate(domain));
    }).catch(function(err){
        res.status(500).json({error: "couldn't retrieve domain"});
    });
}

/*
* Format the creation date on a single domain
*
* @return Array Dates
*/
function formatDomainDate(domain){
	return domCopy = {
			_id: domain._id,
			user: domain.user,
			url: domain.url,
			created: moment(domain.created).format("MMM-DD-YYYY"),
			expiration: domain.expiration
	}
}
