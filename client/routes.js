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
                templateUrl: 'client/views/playRoom.ng.html',
                controller: 'PlayRoomCtrl'
            }
        );
	$stateProvider.state('login', {
                url: '/login',
                templateUrl: 'client/views/login.ng.html',
                controller: 'LoginCtrl'
            }
        );
	// TODO(danilon) change to /play_room
        $urlRouterProvider.otherwise("/login");
    }
]);
