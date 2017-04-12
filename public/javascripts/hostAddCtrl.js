myApp.controller('hostAddCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.imageSelect =  { name: ["Ubuntu",  "Debian", "Fedora", "FreeBSD", "CoreOS", "CentOS" ],
                        selected: "", selectDistro: ""};
    $scope.regSelect = "", $scope.szSelect = "";
    $scope.images = [], $scope.sizes = [], $scope.regions = [];
    $scope.oneclick_images = [], $scope.distro_images = [];
    $scope.sortReg = [];
    $scope.sortSizes = [], $scope.memSizes = [], $scope.standSizes = [];

    var imageFinal = [];
    var sizeFinal = [];
    var regionFinal = [];
    $scope.hostname = "";
    refresh();

    function refresh() {
        $('[data-toggle="popover"]').popover();
        $('#distributions').addClass("selected");
        $('.oneclickapps').hide();
        $('#standardSizes').addClass("selected");
        $('.memorySizes').hide();
        $http.get('/hosting/api').then(function(result) {
                $scope.images = result.data.images
                sortImages();
                $scope.sizes = result.data.sizes;
                $scope.sortSizes = $.extend(true,{},$scope.sizes);
                $scope.standSizes = $.extend(true,{},$scope.sizes);
                sortSizes(true);
                $scope.regions = result.data.regions;
                sortRegions();
         });
    }

    function sortImages(){
        for(img in $scope.images){
            if(!isNaN(parseInt($scope.images[img].name.substring(0,1)))){
                $scope.distro_images.push($scope.images[img]);
            }else{
                $scope.oneclick_images.push($scope.images[img]);
            }
        }
    }

    function sortSizes(init){
        $scope.standSizes = $.extend(true,{},$scope.sortSizes);
        for(size in $scope.sortSizes){
            if($scope.sortSizes[size].slug.substring(0, 1) == "m"){
                delete $scope.standSizes[size];
                if(init){
                    $scope.memSizes.push($scope.sortSizes[size]);
                }
            }
        }
    }

    function sortRegions(){
        $scope.sortReg = [];
        var singReg= {name: "", region:[]};
        var regFound = false;
        var regName = "";
        var lastspace = 0;
        for(reg in $scope.regions){
             lastspace = $scope.regions[reg].name.lastIndexOf(" ");
             regName = $scope.regions[reg].name.substring(0, lastspace);
             singReg= {name: "", region:[]};
             singReg.name = regName;
             singReg.region.push($.extend(true,{},$scope.regions[reg]));
             regFound = false;
            for(srtReg in $scope.sortReg){
                if($scope.sortReg[srtReg].name == regName){
                    regFound = true;
                    $scope.sortReg[srtReg].region.push($.extend(true,{},$scope.regions[reg]));
                }
            } 
            if(!regFound){
                $scope.sortReg.push($.extend(true,{},singReg));
            }
      }
    }

    function sortSizesByImg(){
        var szFound = false;
        var szFoundPos = [];
        $scope.sortSizes = $.extend(true,{},$scope.sizes);
        for(size in $scope.sortSizes){
            if($scope.sortSizes[size].disk < imageFinal.min_disk_size){
                if($scope.sortSizes[size].slug == sizeFinal.slug){
                    sizeFinal = [];
                }
                delete $scope.sortSizes[size];
            }
        }
        sortSizes();
   }

    function sortRegionsByImgOrSize(final){
        sortRegions();
        var regFound = false;
        var found = false;
        var regFoundPos = [];
        var regCityPos = [];

        for(reg in $scope.sortReg){
            found = false;
            regFoundPos = [];
            for(slugReg in $scope.sortReg[reg].region){
                regFound = false;
                for(imgSzReg in final){
                    if($scope.sortReg[reg].region[slugReg].slug == final[imgSzReg] ){
                        regFound = true;
                    }
                }
                if(!regFound){
                    found = true;
                    regFoundPos.push({NamePos: reg, slugPos: slugReg});
                }
            }
            if(found){
                var sub = 0;
                var counter = 0;
                for(pos in regFoundPos){
                    sub = regFoundPos[pos].slugPos - counter;
                    if($scope.sortReg[reg].region[sub].slug == regionFinal.slug){
                        regionFinal = [];
                    }
                    $scope.sortReg[reg].region.splice(sub,1);
                    counter++;
                    if($scope.sortReg[reg].region.length == 0){
                        regCityPos.push({NamePos: reg});
                    }
                }
            }
        }
        var sub = 0;
        var counter = 0;
        for(pos in regCityPos){
             sub = regCityPos[pos].NamePos - counter;
             $scope.sortReg.splice(sub,1);
             counter++;
        }
    }

    $scope.distImgSelect = function(distro, name, $event ){
        sortRegions();
        $scope.imageSelect.selectDistro = distro;
        if(name){
            $scope.imageSelect.selected = name;
            $('.distroBox').removeClass("selected");
            $('.distroList > li').removeClass("selected");
            $(event.currentTarget).addClass("selected");
        }else{
            $('.distroBox').removeClass("selected");
            $('.distroList > li').removeClass("selected");
            $(event.currentTarget).parent().addClass("selected");
        }
        for(img in $scope.images){
            if($scope.images[img].name == $scope.imageSelect.selected){
                imageFinal = $scope.images[img];
            }
        }
        sortSizesByImg();
        sortRegionsByImgOrSize(imageFinal.regions);
        setHostNameVal();
    }
    $scope.sizeSelect = function(slug, $event){
        $scope.szSelect = slug;
        $('.sizeBox').removeClass('selected');
        $(event.currentTarget).addClass('selected');
        for(sz in $scope.sizes){
            if($scope.sizes[sz].slug == slug){
                sizeFinal = $scope.sizes[sz];
            }
        }
        sortRegionsByImgOrSize(sizeFinal.regions);
        setHostNameVal();
    }
    $scope.regionSelect = function(slug, $index, $event, len){
        $scope.regSelect = slug;
        $('.regBox').removeClass('selected');
        $('.regBoxBtmBord').removeClass('selected');
        $('.regBoxBtmBordTwo').removeClass('selected');
        $('.regBoxBtmBordThree').removeClass('selected');
        $(event.currentTarget).addClass("selected");
        $(event.currentTarget).parent().parent().parent().addClass("selected");
        for(reg in $scope.regions){
            if($scope.regions[reg].slug == slug ){
                regionFinal = $scope.regions[reg];
            }
        }
        setHostNameVal();
    }

    $scope.distributions = function($event){
        $('.distributions').show();
        $('.oneclickapps').hide();
        $('.distroMenuTitle > li').removeClass("selected");
        $(event.currentTarget).addClass("selected");
    }
    $scope.oneclick = function($event){
        $('.distributions').hide();
        $('.oneclickapps').show();
        $('.distroMenuTitle > li').removeClass("selected");
        $(event.currentTarget).addClass("selected");
    }
    $scope.standardClick = function($event){
        $('.standardSizes').show();
        $('.memorySizes').hide();
        $('.sizeMenuTitle > li').removeClass("selected");
        $(event.currentTarget).addClass("selected");
    }
    $scope.memoryClick = function($event){
        $('.standardSizes').hide();
        $('.memorySizes').show();
        $('.sizeMenuTitle > li').removeClass("selected");
        $(event.currentTarget).addClass("selected");
    }

    function setHostNameVal(){
        var hostname = "";
        if(imageFinal.slug){
            hostname += imageFinal.distribution;
        }
        if(sizeFinal.slug){
            hostname += "-"+sizeFinal.slug;
        }
        if(regionFinal.slug){
            hostname += "-"+regionFinal.slug;
        }
      //  $('#hostname').val(hostname.toLocaleLowerCase());
      $scope.hostname = hostname.toLowerCase();
    }

    $scope.createServer = function(){
        $scope.final = {image: imageFinal._id, size: sizeFinal._id, region: regionFinal._id, hostname: $scope.hostname };
        $http.post('/hosting/add', $scope.final).then(function(result) {
            console.log("Success!");
            console.log(result);
            window.location.href = "http://localhost:3000/hosting/manage/"+result.data.id;
         }, function errorCallback(response) {
			if(response.status == 500){
				displayError(response.status, response.statusText, response.data.error);
			}
		}); 
    }
    var displayError = function(status, statusText, error){
		$('#errorBox').removeClass('hidden');
		$scope.error = "Error: " + error;
	};
}]);