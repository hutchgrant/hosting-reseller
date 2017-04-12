exports.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
};

exports.notLoggedIn = function(req, res, next) {
	if (!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
};

exports.isLoggedOrAdmin = function(req, res, next) {
	if (req.isAuthenticated() || req.user.admin) { 
			return next();
	}
	res.redirect('/');
};

exports.isAdmin = function(req, res, next) {
	if (req.isAuthenticated()){
		if (req.user.admin) { 
			return next();
		}
	}
	res.redirect('/');
};

exports.isAdminBool = function(req, res, next) {
	if (req.isAuthenticated()){
		if (req.user.admin) { 
			return true;
		}
	}
	return false;
};

exports.sessionUser = function(req, res, next){
	if(!req.session.userid){
		return req.user;
	}else{
		if(req.user.admin){
			return req.session.userid;
		}
		return false;
	}
};