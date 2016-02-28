var app = angular.module('theatreApp', ['firebase', 'ngRoute']);

//routes
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/rooms/:roomId', {
        templateUrl: 'views/room.html',
        controller: 'RoomController'
      }).
      when('/', {
      	templateUrl: 'views/home.html',
      	controller: 'HomeController'
      }).
      otherwise({redirect: "/"});
	}
]);


// create our main controller and get access to firebase
app.controller('HomeController', function($scope) {

  console.log("home");

});

app.controller('RoomController', function($scope, $routeParams) {

	$scope.roomId = $routeParams.roomId;

});