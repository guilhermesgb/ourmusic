angular.module("ourmusic").run(
    function($rootScope, $location) {
        $rootScope.$on("$stateChangeError",
        function(event, next, previous, error) {
            if (error === "AUTH_REQUIRED") {
                $location.path("/");
            }
        });
    }
);

angular.module("ourmusic").config(
    function($urlRouterProvider, $stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);
        $stateProvider.state('play_room', {
                url: '/play_room',
                templateUrl: 'client/play_room/views/playRoom.ng.html',
                controller: 'PlayRoomCtrl'
            }
        );
        $urlRouterProvider.otherwise("/play_room");
    }
);
