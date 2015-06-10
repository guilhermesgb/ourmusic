angular.module("ourmusic").controller("PlayRoomCtrl", [
    '$scope', '$stateParams', '$meteor',
    function($scope, $stateParams, $meteor){
        $scope.$meteorSubscribe("play_rooms").then(function(subscription) {
            $scope.playRoom = $scope.$meteorObject(PlayRooms, {
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
]);
