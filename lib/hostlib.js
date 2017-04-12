var User = require('../models/user');
var Image = require('../models/hosting/image');
var Size = require('../models/hosting/size');
var Region = require('../models/hosting/region');
var Host = require('../models/host');

var DOManage = require('../lib/do-manage');

/*
*  Initialize the digitalocean library with the api key from preferences
* 
*/
exports.init = function(c){
    DOManage.init(c);
}
/*
* Create a new droplet and store it
*
* @param {Object} req Request
* @param {Object} res Response
* @return JSON status success/error 
*/
exports.createDroplet = function(req, res){
	req.checkBody('image', 'Invalid image id').notEmpty().isLength({min:5, max:35});
	req.checkBody('size', 'Invalid size id').notEmpty().isLength({min:5, max:35});
	req.checkBody('region', 'Invalid region id').notEmpty().isLength({min:5, max:35});
    req.checkBody('hostname', 'Invalid Hostname').notEmpty().isLength({min:5, max:25});
	var errors = req.validationErrors();
	if(errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});
		res.status(500).json({messages});	
	}else{
        // validate image, size, region
        var droplet = {user:req.user, hostname:req.body.hostname};
		Image.findById(req.body.image).exec().then(function(image){
            droplet.image = image;
            return Size.findById(req.body.size).exec();
        }).then(function(size){
            droplet.size = size;
            return 	Region.findById(req.body.region).exec();
        }).then(function(region){
            droplet.region = region;
            DOManage.createDroplet(droplet, res);
        });
	}
}

/*
* Remove a droplet from local storage and from digital ocean
*
* @param {Object} req Request
* @param {Object} res Response
* @return JSON status success/error
*/
exports.removeDroplet = function(req, res){
    removeDroplet(req.body.id, req.user).then(function(result){
        req.status(200).json({success: "droplet removed!"});
    }, function(err){
        req.status(500).json({error: "couldn't remove droplet"});
    });
}

/*
* remove droplet from local database
*
* @param {int} id the of the droplet object we're removing
* @param {Object} user the req.user object who is removing
* @return Object Region
*/
function removeDrop(id, user){
    return new Promise(function(resolve, reject){
        Host.remove({dropid: id, user: user}, function(err, result){
            if(err){
                reject();
            }else{
                DOManage.deleteDroplet(id).then(function(result){  /// TODO: what if user != owner of droplet id ?
                    resolve();
                }, function(err){
                    reject();
                });  
            }
        });
    });
}

/*
* Manage a droplet
*
* @param {Object} req Request
* @param {Object} res Response
* @return rendered page or 404 error
*/
exports.manageDroplet = function(req, res, next){
    Host.findOne({dropid: req.params.id, user: req.user}).populate(['image', 'size', 'region']).exec().then(function(droplet){
        res.render('hosting/manage', { server: droplet});
    }, function(err){
        next();
    });
}

/*
* Query all available images, sizes, and regions
*
* @param {Object} req Request
* @param {Object} res Response
* @return JSON Array images, sizes, regions or error
*/
exports.getAllAvail = function(req, res){
    var response = {};
    Image.find({}).exec().then(function(images){
        response.images = images;
        return Size.find({}).exec();
    }).then(function(sizes){
        response.sizes = sizes;
        return Region.find({}).exec();
    }).then(function(regions){
        response.regions = regions;
        res.status(200).json(response);
    }).catch(function(err){
        res.status(500).json({error: "error retrieving cached api data"});
    });
}

/*
* Query all of a specific user's droplets
*
* @param {Object} req Request
* @param {Object} res Response
* @return JSON Array droplets
*/
exports.getUserDroplets = function(req, res){
    var limit = 20;
    if(parseInt(req.params.limit) <= 100){
        limit = parseInt(req.params.limit);
    }
    Host.paginate({ user: req.user}, { page: req.params.page, limit: limit, populate: ['image', 'size', 'region'] }).then(function(droplets){
        res.status(200).json(droplets);
    }).catch(function(err){
        res.status(500).json({error: "no droplets found"});
    });
}

/*
* Get Single Droplet
*
* @param {Object} req Request
* @param {Object} res Response
* @return JSON Object droplet
*/
exports.getSingleDroplet = function(req, res){
    Host.findOne({dropid: req.params.id, user: req.user}).populate(['image', 'size', 'region']).exec().then(function(droplet){
        res.status(200).json(droplet);
    }).catch(function(err){
        res.status(500).json({error:"couldn't find droplet"});
    });
}