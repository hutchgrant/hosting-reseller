myApp.controller('hostCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.hosts = [];
    $scope.totalHosts = 0;
    $scope.options = [
        {name: '5', value: 5}, 
        {name: '10', value: 10},
        {name: '25', value: 25}
    ];
    var errorFound = false;
    $scope.hostsPerPage = $scope.options[0].value;
    getResultsPage(1);

    $scope.pagination = {
        current: 1
    };

    $scope.pageChanged = function(newPage) {
        getResultsPage(newPage);
    };

    $scope.pageAmtChange = function(){
        getResultsPage($scope.pagination.current);
    }

    function getResultsPage(pageNumber) {
         $('.nohosts').hide();
        if(errorFound){
            $('#errorBox').addClass('hidden');
        }
        $http.get('/dashboard/hosting/list/' + pageNumber + '/' + $scope.hostsPerPage).then(function(result) {
                $scope.hosts = result.data.docs;
                $scope.totalHosts = result.data.total;
         }, function errorCallback(response) {
			if(response.status == 500){
                if(response.data.error == "no droplets found"){
                    $('.hostlist').hide();
                    $('.pageAmtCtrls').hide();
                    $('.nohosts').show();
                }else{
				    displayError(response.status, response.statusText, response.data.error);
                }
			}
		}); 
    }
	$scope.remove = function(id) {
		$http.delete('/dashboard/hosting/remove/' + id).then(function(response){
			getResultsPage($scope.pagination.current);
		}, function errorCallback(response) {
			if(response.status == 500){
				displayError(response.status, response.statusText, response.data.error);
			}
		}); 
	}
    $scope.manage = function(id) {
       	window.location.href = "/hosting/manage/"+id;
    }
    var displayError = function(status, statusText, error){
		$('#errorBox').removeClass('hidden');
        errorFound = true;
		$scope.error = "Error: " + error;
	};
}]);