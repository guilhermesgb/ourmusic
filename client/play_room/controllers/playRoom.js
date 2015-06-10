angular.module("ourmusic").controller("PlayRoomCtrl",
    function($scope, $stateParams, $meteor){
        $meteor.subscribe("play_rooms", {
            'roomId': 'GLOBAL'
        }).then(function(subscription) {
            $scope.playRoom = $meteor.object(PlayRooms, {
                'roomId': 'GLOBAL'
            });
        });

        $scope.startOrResumePlaying = function() {
            $meteor.call("play", $scope.playRoom.roomId,
              $scope.playRoom.playerState).then(
                function(message) {
                    alert(message);
                }, function(error) {
                    alert(error);
                }
              );
        }
    }
);
