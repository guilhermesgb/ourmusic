angular.module("ourmusic").controller("PlayRoomCtrl", [
    '$scope', '$stateParams', '$meteor',
    function($scope, $stateParams, $meteor) {
        $meteor.subscribe("play_rooms").then(function(subscription) {
            $scope.playRoom = $meteor.object(PlayRooms, {
                'roomId': 'GLOBAL'
            });

	    /////////// Plays if the server says to /////////////
	    $meteor.session("playerInitialized").bind($scope, "playerInitialized");
	    $meteor.autorun($scope, function (c) {
		if(Session.get("playerInitialized") && $scope.playRoom.playerState.playing) {
		    c.stop();
		    console.log("Continue Playing... " + $scope.playing);
		    $meteor.call("play",$scope.playRoom.roomId);
		}
	    });
	    //////////////////////////////////////////////////////

            $scope.startOrResumePlayer = function() {
                $meteor.call("play", $scope.playRoom.roomId).then(
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
        });
    }
]);
