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

app.controller('MainController', function($scope) {
	var ref = new Firebase("https://thea2gether.firebaseio.com/");

	$scope.createUser = function(createUserData) {
		if (createUserData.password1 != createUserData.password2) {
			alert("Your passwords don't match!");
			return;
		}
		ref.createUser({
			email: createUserData.email,
			password: createUserData.password1,
		}, function(error, userData) {
			if (error) {
				console.log("Error creating user:", error);
				alert(error);
			} else {
				console.log(userData.uid);
				// storing user's username
				var userRef = ref.child("users").child(userData.uid);
				userRef.set({
					username: createUserData.username
				});
				console.log("Successfully created user account with uid:", userData.uid);
			}
		});
	};

	$scope.loginUser = function(loginUserData) {
		ref.authWithPassword({
			email    : loginUserData.email,
			password : loginUserData.password
		}, function(error, authData) {
			remember: 'sessionOnly'
			if (error) {
				console.log("Login Failed!", error);
			} else {
				console.log("Authenticated successfully with payload:", authData);
			}
		});
	};

	$scope.logoutUser = function() {
		console.log("Logging out")
		ref.unauth();
	};

	$scope.isLoggedIn = function() {
		return ref.getAuth() != null;
	}

	$scope.getUsername = function() {
		console.log("Get username");
		if (ref.getAuth() == null) return "";
		console.log(ref.getAuth().uid);
		var usernameRef = ref.child("users").child(ref.getAuth().uid).child("username");
		var username = usernameRef.once("value", function(snap) {
			$scope.username = snap.val();
		});
		console.log($scope.username);
		return $scope.username;
	}
});

app.controller('HomeController', function($scope, $firebaseArray, $firebase, $firebaseObject) {
  var ref = new Firebase("https://thea2gether.firebaseio.com/rooms");

  // create a synchronized array
  $scope.rooms = $firebaseArray(ref);

  $scope.addRoom = function(form) {
      var url = $('#youTubeUrl').val();
      if (url != undefined || url != '') {
          var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
          var match = url.match(regExp);
          if (match && match[2].length == 11) {
              // Do anything for being valid
              // if need to change the url to embed url then use below line
              $('#videoObject').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=1&enablejsapi=1');
			  console.log("Adding a room");
			  $scope.rooms.$add({
				  roomTitle: form.roomTitle,
				  roomDesc: form.roomDesc,
				  youtubeUrl: form.youtubeUrl,
				  messages: []
			  }).then(function(ref){
				  var roomNumber = ref.key();
          ref.child('id').set(roomNumber);
				  ref.on('value', function(snapshot) {
            //on change
				  });
			  });
          } else {
              alert('not valid');
              // Do anything for not being valid
          }
      }
  	console.log("Adding a room");
  	$scope.rooms.$add({
  		roomTitle: form.roomTitle,
  		roomDesc: form.roomDesc,
  		youtubeUrl: form.youtubeUrl,
  		messages: []
  	}).then(function(ref){
  		var roomNumber = ref.key();

  		// After we added the room
  		console.log('Added a room');
  		ref.child('id').set(roomNumber);
  		ref.on('value', function(snapshot) {
  			// what to do when the value of the room changes
  			console.log("Room was changed")
  			console.log(snapshot.val().roomTitle);
  		});
  		
  		console.log(roomNumber);
  	});
  };
});


app.controller('RoomController', function($scope, $routeParams, $firebaseArray, $firebase, $firebaseObject) {
  $scope.roomId = $routeParams.roomId;
  var ref = new Firebase("https://thea2gether.firebaseio.com/rooms");
  var room = ref.child($scope.roomId);
  var messages = room.child("messages");
  $scope.room = $firebaseObject(room);
  $scope.messages = $firebaseArray(messages);

  $scope.message = "";

  $scope.addMessage = function() {
    $scope.messages.$add({
      user: $scope.getUsername(),
      text: $scope.message
    }).then(function(ref){
      $scope.message = "";
    });
  }
  
});