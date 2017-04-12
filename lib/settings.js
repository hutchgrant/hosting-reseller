var Preference = require('../models/preferences');
var DOManage = require('../lib/do-manage');

/*
* Update site preferences
* 
* @param {Object} req Request
* @param {Object} res Response
* @return JSON success/error
*/
exports.updatePref = function(req, res){
    var sitepref = {sitename:req.body.name, sitetag:req.body.tag, copyright:req.body.copyright};
    var upPref = Preference.update({preftype:'main'}, sitepref).exec();
    upPref.then(function(result){
        req.app.setConfig(sitepref);
        res.status(200).json({success:"Site Preferences saved"});
    })
    .catch(function(err){
        res.status(500).json({error:"Preferences could not be saved"});
    });
}

/*
* Update DigitalOcean API Key
* 
* @param {Object} req Request
* @param {Object} res Response
* @return JSON success/error
*/
exports.updateAPIKey = function(req, res){
    var apikey = {do_key:req.body.dokey}
    var upKey = Preference.findOneAndUpdate({preftype:'main'}, apikey).exec();
    upKey.then(function(result){
        req.app.setConfig(result);
        DOManage.init(apikey);
        DOManage.getAllDO(res);
    })
    .catch(function(err){
        res.status(500).json({error:"API Key could not be saved"});
    });
}

/*
* Query site preferences
* 
* @return Object preferences 
*/
function queryPreferences(){
    var getPref = Preference.findOne({preftype:'main'}).exec();
    getPref.then(function(pref){

    })
    .catch(function(err){

    });
}