var app = angular.module('theatreApp', ['firebase', 'ngRoute']);

//routes
app.config(['$routeProvider',"$sceDelegateProvider",
  function($routeProvider, $sceDelegateProvider) {
	  $sceDelegateProvider.resourceUrlWhitelist([
		  'self',
		  'https://www.youtu.be/**',
		  'https://www.youtube.com/**'
	  ]);


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

  $scope.createUser = function(email, password, username) {
  	ref.createUser({
  		email: email,
  		password: password,
  	}, function(errorUserData) {
  		if (error) {
  			console.log("Error creating user:", error);
  		} else {
  			// storing user's username
  			var userRef = new ref.child("users/" + userData.uid);
  			userRef.set({
  				username: username
  			});
  			console.log("Successfully created user account with uid:", userData.uid);
  		}
  	});
  };

  $scope.loginUser = function(email, password) {
  	ref.authWithPassword({
  		email    : email,
  		password : password
  	}, function(error, authData) {
  		if (error) {
  			console.log("Login Failed!", error);
  		} else {
  			console.log("Authenticated successfully with payload:", authData);
  		}
  	});
  };


	$scope.getId = function(url){
		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
		var match = url.match(regExp);
		return (match&&match[7].length==11)? match[7] : false;
	}

  // create a synchronized array
  $scope.rooms = $firebaseArray(ref);
  $scope.addRoom = function(form) {
      var url = $('#youTubeUrl').val();
	  $scope.yturl = url.replace("watch?v=", "v/");
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
  };
});


app.controller('RoomController', function( $scope, $routeParams, $firebaseArray, $firebase, $firebaseObject, $sce) {

  $scope.roomId = $routeParams.roomId;
  var ref = new Firebase("https://thea2gether.firebaseio.com/rooms");
  var room = ref.child($scope.roomId);
  var messages = room.child("messages");
  $scope.room = $firebaseObject(room);
  $scope.messages = $firebaseArray(messages);
	//$scope.yturl = $sce.trustAsResourceUrl('/www.youtube.com/embed/'+ $rootScope.getId($scope.room.youtubeUrl));
	console.log($scope.room.youtubeUrl);

	$scope.getId = function(url){
		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
		var match = url.match(regExp);
		console.log(url);
		return (match&&match[7].length==11)? match[7] : false;
	}

	$scope.getUrl= function(url){
		return 'https://www.youtube.com/embed/' + $scope.getId(url);
	}
  $scope.user = "";
  $scope.message = "";

  $scope.addMessage = function() {
    $scope.messages.$add({
      user: $scope.user,
      text: $scope.message
    }).then(function(ref){
      $scope.message = "";
    });
  }
  
});