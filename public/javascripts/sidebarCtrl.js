  myApp.controller('sidebarCtrl', ['$scope', '$http', function($scope, $http) {
    $("#menu").metisMenu();
    var contentSize = $(".adminDash").outerHeight();
    console.log("width = "+$(document).width() );
    console.log("width2 = "+$(window).width());
    $(".sidebar").height(contentSize);

    $(window).resize(function() {
      if($(document).width() > "770"){
      $(".sidebar").height(contentSize);
      }else{
        $(".sidebar").height('100%');
      }
  });

  }])