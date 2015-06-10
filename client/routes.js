angular.module("ourmusic").run([
    '$rootScope', '$location',
    function($rootScope, $location) {
        $rootScope.$on("$stateChangeError",
        function(event, next, previous, error) {
            if (error === "AUTH_REQUIRED") {
                $location.path("/");
            }
        });
    }
]);

angular.module("ourmusic").config([
    '$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);
        $stateProvider.state('play_room', {
                url: '/play_room',
                templateUrl: 'client/play_room/views/playRoom.ng.html',
                controller: 'PlayRoomCtrl',
                resolve: {
                    'subscribe': [
                        '$meteor', function($meteor) {
                            return $meteor.subscribe('play_rooms');
                        }
                    ]
                }
            }
        );
        $urlRouterProvider.otherwise("/play_room");
    }
]);