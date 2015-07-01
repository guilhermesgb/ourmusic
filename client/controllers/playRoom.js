angular.module("ourmusic").controller("PlayRoomCtrl", [
    '$scope', '$stateParams', '$meteor','$state',
    function($scope, $stateParams, $meteor,$state) {
        $meteor.subscribe("userData").then(function(subscription) {
            $meteor.subscribe("play_rooms").then(function(subscription) {
		$scope.playRoom = $meteor.object(PlayRooms, {
                    'roomId': 'GLOBAL'
		});

		playbackCallbackError = function(error){
		    if (error === "TOKEN_UNAUTHORIZED") {
			$state.go('login');
		    } else {
			alert(error + " error, Try Again...");
		    }
		}
		
		$scope.startOrResumePlayer = function() {
                    $meteor.call("play", $scope.playRoom.roomId, playbackCallbackError).then(
			function() {
                            console.log("Play request placed successfully.");
			}, function(error) {
                            alert(error);
			}
                    );
		}
                $scope.pausePlayer = function() {
                    $meteor.call("pause", $scope.playRoom.roomId).then(
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

                if ($scope.playRoom.playerState.playing === true) {
                    $scope.startOrResumePlayer();
                }
            });
        });
    }
]);
