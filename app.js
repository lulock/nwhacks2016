// create our angular module and inject firebase
angular.module('theatreApp', ['firebase', 'ngRoute'])

// create our main controller and get access to firebase
.controller('mainController', function($scope, $firebaseArray, $firebase, $firebaseObject) {

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
  		var roomNumber = ref.name();
  		ref.key();
  		console.log(roomNumber);
  	});
  };
});