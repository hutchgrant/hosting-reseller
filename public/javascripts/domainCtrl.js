myApp.controller('domainCtrl', ['$scope', '$http', function($scope, $http) {

	var displayError = function(status, statusText, error){
		$('#errorBox').removeClass('hidden');
		$scope.error = "Error: " + error;
	};
	var showDomainForm = function(disp, update){
		if(!disp){
			$('#domain-form').addClass('hidden');
			$('#btn-update').hide();
			$('#btn-add').hide();	
		}else{
			$('#domain-form').removeClass('hidden');
			if(update){
				$('#btn-add').hide();
				$('#btn-update').show();
			}else{
				$('#btn-add').show();
				$('#btn-update').hide();
			}
		}
	};
	var refresh = function() {
		$('#errorBox').addClass('hidden');
		showDomainForm(false, false);
		$http.get('/dashboard/domain/list').then(function(response){
			$scope.domainlist = response.data;
			$scope.domain = null;
		});
	};
	refresh();

	$scope.addNewDomain = function(){
		showDomainForm(true, false);
	}
	$scope.createDomain = function(){
		$scope.domain.expiration = new Date($scope.domain.expiration);
		$http.post('/dashboard/domain/add', $scope.domain).then(function(response){
			refresh();
		}); 
	}

	$scope.remove = function(id) {
		$http.delete('/dashboard/domain/remove/' + id).then(function(response){
			refresh();
		});
	}

	$scope.edit = function(id){
		$http.get('/dashboard/domain/' + id).then(function(response){
			$scope.domain = response.data;
			$scope.domain.expiration = new Date($scope.domain.expiration);
			showDomainForm(true, true);
		}); 
	}

	$scope.update = function(){
		$http.post('/dashboard/domain/update/' + $scope.domain._id, $scope.domain).then(function(response){
			refresh();
		}, function errorCallback(response) {
			if(response.status == 500){
				displayError(response.status, response.statusText, response.data.error);
			}
		});
	}

	$scope.deselect = function(){
		$scope.domain = null;
	}
	$scope.sort = function(keyname){
        $scope.sortKey = keyname;
        $scope.reverse = !$scope.reverse;
    }
}]);