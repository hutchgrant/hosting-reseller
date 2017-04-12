var DigitalOcean = require('do-wrapper');
var mongoose = require('mongoose');
var Promise = require('bluebird');

var Host = require('../models/host');
var Region = require('../models/hosting/region');
var Image = require('../models/hosting/image');
var Size = require('../models/hosting/size');

var api;

/*
*  Initialize the digitalocean api key from preferences
* 
*/
exports.init = function(c){
    api = new DigitalOcean(c.do_key, 100);
}

/*
* Get DO account info
*
* @return output account
*/
exports.getAccount = function(){
    api.account((err, res, body) => {
	    console.log(body);
	}); 
};

/*
* Create a new DO droplet and store it
*
* @param {Object} droplet Host object
* @param {Object} OriginRes Response
* @return JSON status success/error 
*/
exports.createDroplet = function(droplet, OriginRes){
        /// TODO: Add additional parameters
        api.dropletsCreate({
            "name": droplet.hostname,
            "region": droplet.region.slug,
            "size": droplet.size.slug,
            "image": droplet.image.slug,
            "ssh_keys": null,
            "backups": false,
            "ipv6": true,
            "user_data": null,
            "private_networking": null,
            "volumes": null,
            "tags": [
                "web"
            ]
        }, (err, res, body) => {
            if(err){
                OriginRes.status(500).json({error:"couldn't create droplet"});
            }else{
                var host = new Host();
                host.dropid = body.droplet.id;
                host.user = droplet.user;
                host.name = body.droplet.name;
                host.memory = body.droplet.memory;
                host.vcpus = body.droplet.vcpus;
                host.disk = body.droplet.disk;
                host.locked = body.droplet.locked;
                host.status = body.droplet.status;
                host.kernel = body.droplet.kernel;
                host.created = body.droplet.created_at;
                host.feature = body.droplet.features;
                host.backup = body.droplet.backup_ids;
                host.next_backup_window = body.droplet.next_backup_window;
                host.snapshot_ids = body.droplet.snapshot_ids;
                host.image = droplet.image;
                host.volume_ids = body.droplet.volume_ids;
                host.size = droplet.size;
                host.size_slug = body.droplet.size_slug;
                host.networks = body.droplet.networks;
                host.region = droplet.region;
                host.tags = body.droplet.tags;
                host.save().then(function(result){
                    OriginRes.status(200).json({id:host.dropid});
                }).catch(function(err2){
                    console.log(err2);
                    OriginRes.status(500).json({error:"couldn't save droplet"});
                })
            }
        });
};

/*
* Remove DO droplet
*
* @param {int} id the id of the droplet we're removing
* @return Promise
*/
exports.deleteDroplet = function(id){
    return new Promise(function(resolve, reject){
        api.dropletsDelete(id, function(err, result){
            if(err){
                reject();
            }else{
                resolve();
            }
        });
    });
}


/*
* Query and store all DO sizes, images, regions
*
* @param {Object} res Response
* @return JSON status success/error
*/
exports.getAllDO = function(res) {
    storeRegions().then(function(){
        return storeImages();
    }).then(function(){
        return storeSizes();
    }).then(function(){
        res.status(200).json({success:"All Digital Ocean Images, Regions, And Sizes Installed"});
    }).catch(function(){
        res.status(500).json({error:"Couldn't retrieve and store DigitalOcean API Data. Check that your API key is correct."});
    });
};

/*
* Store/update all DO regions
*
* @return Promise
*/
function storeRegions(){
    return new Promise(function(resolve, reject){
        api.regionsGetAll({}, (err, res2, body) => {
            Promise.each(body.regions,function(region){
                var reg = new Region(); 
                reg.name = region.name;
                reg.slug = region.slug;
                for(size in region.sizes ){
                    reg.size[size] = region.sizes[size];
                }
                for(feature in region.features ){
                    reg.feature[feature] = region.features[feature];
                }
                reg.available = region.available;

                Region.findOne({slug:region.slug}).exec().then(function(result){
                    result.name = region.name;
                    for(size in region.sizes ){
                        result.size[size] = region.sizes[size];
                    }
                    for(feature in region.features ){
                        result.feature[feature] = region.features[feature];
                    }
                    result.available = region.available;
                    result.save();
                }).catch(function(err){
                    reg.save();
                });
            }).then(function(){
                console.log("ALL REGION DATA STORED");
                resolve();
            }).catch(function(err){
                reject();
            });
        });
    });
}

/*
* Store/update all DO images
*
* @return Promise
*/
function storeImages(){
    return new Promise(function(resolve, reject){
        api.imagesGetAll({}, (err, res2, body) => {
            Promise.each(body.images,function(image){
                var img = new Image(); 
                img.name = image.name;
                img.distribution = image.distribution;
                if(image.slug == null){
                    img.slug = "n/a"
                }else{
                    img.slug = image.slug;
                }
                img.public = image.public;
                for(reg in image.regions ){
                    img.regions[reg] = image.regions[reg];
                }
                img.created = image.created_at;
                img.min_disk_size = image.min_disk_size;
                img.type = image.type;
                img.size_gigabytes = image.size_gigabytes;
                
                Image.findOne({name:image.name}).exec().then(function(result){
                    result.distribution = image.distribution;
                    if(image.slug == null){
                        result.slug = "n/a"
                    }else{
                        result.slug = image.slug;
                    }
                    result.public = image.public;
                    for(reg in image.regions ){
                        result.regions[reg] = image.regions[reg];
                    }
                    result.created = image.created_at;
                    result.min_disk_size = image.min_disk_size;
                    result.type = image.type;
                    result.size_gigabytes = image.size_gigabytes;

                    result.save();
                }).catch(function(err){
                    img.save(); 
                });
            }).then(function(){
                console.log("ALL IMAGE DATA STORED");
                resolve();
            }).catch(function(err){
                reject();
            });
        });   
    });
}

/*
* Store/update all DO sizes
*
* @return Promise
*/
function storeSizes(){
    return new Promise(function(resolve, reject){
        api.sizesGetAll({}, (err, res2, body) => {
            Promise.each(body.sizes,function(dropsize){
                var size = new Size();
                size.slug = dropsize.slug;
                size.vcpus = dropsize.vcpus;
                size.disk = dropsize.disk;
                size.transfer = dropsize.transfer;
                size.memory = dropsize.memory
                size.price_monthly = dropsize.price_monthly;
                size.price_hourly = dropsize.price_hourly;
                for( reg in dropsize.regions){
                    size.regions[reg] = dropsize.regions[reg];
                }
                size.available = dropsize.available;

                Size.findOne({slug:dropsize.slug}).exec().then(function(result){
                    result.slug = dropsize.slug;
                    result.vcpus = dropsize.vcpus;
                    result.disk = dropsize.disk;
                    result.transfer = dropsize.transfer;
                    result.memory = dropsize.memory
                    result.price_monthly = dropsize.price_monthly;
                    result.price_hourly = dropsize.price_hourly;
                    for( reg in dropsize.regions){
                        result.regions[reg] = dropsize.regions[reg];
                    }
                    result.available = dropsize.available;
                    result.save();
                }).catch(function(err){
                    size.save();
                });
            }).then(function(){
                console.log("ALL SIZE DATA STORED");
                resolve();
            }).catch(function(err){
                reject();
            });
        }); 
    });
}