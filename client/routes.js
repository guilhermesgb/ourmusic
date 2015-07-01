angular.module("ourmusic").run(["$rootScope", "$state", function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
	if (error === "AUTH_REQUIRED") {
	    $state.go('login');
	}
    });
}]);

angular.module("ourmusic").config([
    '$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);
        $stateProvider.state('play_room', {
            url: '/play_room',
            templateUrl: 'client/views/playRoom.ng.html',
            controller: 'PlayRoomCtrl',
	    resolve: {
		"currentUser": ["$meteor", function($meteor){
		    return $meteor.requireUser();
		}]
	    }
        }
        );
	$stateProvider.state('login', {
                url: '/login',
                templateUrl: 'client/views/login.ng.html',
                controller: 'LoginCtrl'
            }
        );
        $urlRouterProvider.otherwise("/play_room");
    }
]);
