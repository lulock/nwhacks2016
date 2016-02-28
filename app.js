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


app.controller('HomeController', function($scope, $firebaseArray, $firebase, $firebaseObject) {

  var ref = new Firebase("https://thea2gether.firebaseio.com/rooms");
  // create a synchronized array
  $scope.rooms = $firebaseArray(ref);

  $scope.addRoom = function(form) {
  	console.log("Adding a room");
  	$scope.rooms.$add({
  		roomTitle: form.roomTitle,
  		roomDesc: form.roomDesc,
  		youtubeUrl: form.youtubeUrl,
  		messages: []
  	}).then(function(ref){
  		// After we added the room
  		console.log('Added a room');
  		ref.on('value', function(snapshot) {
  			// what to do when the value of the room changes
  			console.log("Room was changed")
  			console.log(snapshot.val().roomTitle);
  		});
  		var roomNumber = ref.key();
  		
  		console.log(roomNumber);
  	});
  };
});


app.controller('RoomController', function($scope, $routeParams) {
  $scope.roomId = $routeParams.roomId;
});