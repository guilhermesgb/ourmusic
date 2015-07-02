angular.module("ourmusic").controller("PlayRoomCtrl", [
    '$scope', '$stateParams', '$meteor', '$rootScope', '$state',
    function($scope, $stateParams, $meteor, $rootScope, $state) {
        $meteor.subscribe("userData").then(function(subscription) {
            $meteor.subscribe("play_rooms").then(function(subscription) {

                $meteor.call("enterRoom", "GLOBAL");
                $scope.playRoom = $meteor.object(PlayRooms, {});

		playbackCallbackError = function(error){
		    if (error === "TOKEN_UNAUTHORIZED") {
			$state.go('login');
		    } else {
			alert(error + " error, Try Again...");
		    }
		}
		
		$scope.startOrResumePlayer = function() {
                    $meteor.call("play", playbackCallbackError).then(
			function() {
                            console.log("Play request placed successfully.");
			}, function(error) {
                            alert(error);
			}
                    );
		}
                $scope.pausePlayer = function() {
                    $meteor.call("pause").then(
                        function() {
                            console.log("Pause request placed successfully.");
                        }, function(error) {
                            alert(error);
                        }
                    );
                }

                $scope.sendOperationToPlayer = function() {
                    if ($scope.playRoom.playerState.playing === true) {
                        $scope.pausePlayer();
                    } else {
                        $scope.startOrResumePlayer();
                    }
                }
                if ($scope.playRoom.leader === $rootScope.currentUser._id && $scope.playRoom.playerState.playing === true) {
                    $scope.startOrResumePlayer();
                }
            });
        });
    }
]);
