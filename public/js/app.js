var app = angular.module('omj',['ngRoute']);

app.run(function($rootScope) {
    $rootScope.searchShow = true;
});

app.config(['$locationProvider','$routeProvider',function($locationProvider,$routeProvider){
	$routeProvider.
		when('/home', {
			templateUrl: '../views/listFestivals.html',
			controller: 'ListCtrl'
		}).
		when('/festivalDetails/:id', {
			templateUrl: '../views/details.html',
			controller: 'DetailsCtrl'
		}).
		when('/favorite', {
			templateUrl: '../views/favorite.html',
			controller: 'FavoriteCtrl'
		}).
		otherwise({ redirectTo: '/home' });

	// use the HTML5 History API
    // $locationProvider.html5Mode(true);

}]);

app.filter('cmdate', [
    '$filter', function($filter) {
        return function(input, format) {
            return $filter('date')(new Date(input), format);
        };
    }
]);

app.filter('firstImage', function() {

  // In the return function, we must pass in a single parameter which will be the data we will work on.
  // We have the ability to support multiple other parameters that can be passed into the filter optionally
  return function(imageUrl) {

    var result;
   	result = imageUrl.split(",");
    // Do filter work here

    return result[0];

  }

});

app.filter('cmdate', [
    '$filter', function($filter) {
        return function(input, format) {
            return $filter('date')(new Date(input), format);
        };
    }
]);

app.controller('ListCtrl', ['$scope','$http','$rootScope', function($scope,$http,$rootScope) {

	$rootScope.searchShow = true;

    $.ajax({
    	url: 'http://54.178.175.229/festivals',  //Server script to process data
        type: 'get',
        beforeSend: function(xhr){
        	//xhr.setRequestHeader('Authorization', 'Basic SU9TX0NMSUVOVDpIdTMzQFgyMGw1');
        },
        success: function(data){
        	//console.log(data);
        	$scope.festivals = data.results;
        	$scope.$apply();
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		    alert(XMLHttpRequest);
		    alert(textStatus);
		},
    });


	// $http.get('http://54.178.175.229/festivals').success(function(data){
	// 	console.log(data);
	// });
}]);

app.controller('DetailsCtrl', ['$scope','$routeParams','$rootScope', function ($scope,$routeParams,$rootScope) {

	$rootScope.searchShow = false;

	$.ajax({
    	url: 'http://54.178.175.229/festivals/' + $routeParams.id,  //Server script to process data
        type: 'get',
        beforeSend: function(xhr){
        	//xhr.setRequestHeader('Authorization', 'Basic SU9TX0NMSUVOVDpIdTMzQFgyMGw1');
        },
        success: function(data){
        	//console.log(data);
        	$scope.festival = data.result;

        	var imageArray = $scope.festival.festival_pictures.split(",");

        	for(var i=0;i<imageArray.length;i++){
        		var imageList = "<li><img src='" + imageArray[i] + "'></li>";
        		$('.bxslider').append(imageList);

        		if(i === imageArray.length - 1){
        			$('.bxslider').bxSlider();
        		}
        	}

        	var myLatLng = { lat:$scope.festival.festival_latitude, lng:$scope.festival.festival_longitude };

        	$scope.map = new google.maps.Map(document.getElementById('map'), {
				    zoom: 12,
				    center: myLatLng
				  });

        	$scope.marker = new google.maps.Marker({
				    position: myLatLng,
				    map: $scope.map,
				    title: $scope.festival.festival_name
				  });

        	$scope.$apply();

		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
		    alert(XMLHttpRequest);
		    alert(textStatus);
		},
    });
}]);

app.controller('FavoriteCtrl', ['$scope', function ($scope) {
	
}]);