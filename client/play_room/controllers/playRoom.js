angular.module("ourmusic").controller("PlayRoomCtrl", [
    '$scope', '$stateParams', '$meteor',
    function($scope, $stateParams, $meteor) {
        $meteor.subscribe("play_rooms").then(function(subscription) {
            $scope.playRoom = $meteor.object(PlayRooms, {
                'roomId': 'GLOBAL'
            });

            $scope.startOrResumePlaying = function() {
                $meteor.call("play", $scope.playRoom.roomId).then(
                    function(message) {
                        alert(message);
                    }, function(error) {
                        alert(error);
                    }
                );
            }
        });
    }
]);
