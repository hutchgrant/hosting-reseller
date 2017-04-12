myApp.controller('adminCtrl', ['$scope', '$http', function($scope, $http) {
    if(dokey !== null){ 
        $scope.site = {dokey:dokey};
    }else{
        $scope.site = {name: sitename, tag:sitetag, copyright:copyright};
    }
    $scope.fill = function(type){
        var url = "";
        if(type == "account"){
            url = "/admin/hosting/account";
        }else if(type == "regions"){
            url = "/admin/hosting/regions"
        }else if(type == "sizes"){
            url = "/admin/hosting/sizes"
        }else if(type == "images"){
            url = "/admin/hosting/images"
        }
        submit(url, "GET", "");
    }

    $scope.saveAPI = function(){
        submit('/admin/digitalocean/submit', "POST", $scope.site);
    }
    $scope.saveSettings = function(){
        submit('/admin/preferences/submit', "POST", $scope.site);
    }

   function submit(url, method, data){
        $http({
            method: method,
            url: url,
            data: data
        }).then(function(response) {
            if(response.status == "200"){
                $('#errorBox').addClass('hidden');
                $('#successBox').removeClass('hidden');
                $scope.serverSuccess = response.data.success;
            }
        }, function(response){
            if(response.status = "500"){
                $('#errorBox').removeClass('hidden');
                if(response.data.error != undefined){
                    $scope.serverErrors = response.data.error;
                }else{
                    $scope.serverErrors = "error detected";
                }
            }else{
                console.log(response);
            }
        });      
    } 
    
}]);
