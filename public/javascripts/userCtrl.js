myApp.controller('userCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.users = [];
    $scope.totalUsers = 0;
    $scope.options = [
        {name: '2', value: 2}, 
        {name: '25', value: 25}
    ];
    $scope.usersPerPage = $scope.options[0].value;
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
        $http.get('/admin/list/' + pageNumber + '/' + $scope.usersPerPage)
            .then(function(result) {
                $scope.users = result.data.docs;
                $scope.totalUsers = result.data.total;
            });
    }
}]);