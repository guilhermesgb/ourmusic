angular.module("ourmusic").controller("PlayRoomCtrl", [
    '$scope', '$stateParams', '$meteor',
    function($scope, $stateParams, $meteor) {
        $meteor.subscribe("play_rooms").then(function(subscription) {
            $scope.playRoom = $meteor.object(PlayRooms, {
                'roomId': 'GLOBAL'
            });

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
        });
    }
]);
