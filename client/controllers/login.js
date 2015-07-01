angular.module("ourmusic").controller("LoginCtrl", [
    '$scope', '$stateParams', '$meteor', '$window','$location','$rootScope',
    function($scope, $stateParams, $meteor, $window,$location,$rootScope) {
	$scope.client_id = "a86d7ad4269d4a6ea18b167c1f5b811d";
	$scope.redirect_uri = "http://ourmusic-test.meteor.com/login";
	$scope.scope = "user-read-private";
        $meteor.subscribe("userData").then(function(subscription) {
	    $scope.callLogin = function(code,redirect_uri){
		$meteor.call("authenticateSpotifyCode",code,redirect_uri).then(
		    function(username){
			console.log('success inviting', username);
			Meteor.loginWithPassword(username,code,
				function(error){
				    if(error) {
					console.log(error);
				    } else {
					console.log("authToken", Meteor.user().accessToken);
					Session.set("authToken", Meteor.user().accessToken);
					$location.path("/play_room");
					console.log("logou e mudou de pagina");
				    }
				});
		    },
		    function(err){
			console.log('failed', err);
		    }
		);
	    }

	    if($location.search().code){
		$scope.callLogin($location.search().code,$scope.redirect_uri);
	    } else if($location.search().error){
		alert($location.search().error);
	    }

	    $scope.loginButtonClicked = function($event){
                console.log("Login button clicked;");
		if(Meteor.isCordova){
                    console.log("OurMusicPlugin will handle login.");
                    OurMusicPlugin.login(function(message) {
			console.log("Login: " + message);
			$scope.callLogin(message,"ourmusic://spotify-callback/");
		    }, function(error) {
			alert(error);
		    });
		} else {
                    console.log("Browser will handle login.");
		    $window.location.href = 'https://accounts.spotify.com/en/authorize?client_id='+$scope.client_id+'&response_type=code&redirect_uri='+$scope.redirect_uri+'&scope='+$scope.scope+'&show_dialog=true';
		}
	    }
        });
    }
]);
