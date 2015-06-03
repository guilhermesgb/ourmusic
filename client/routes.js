angular.module("ourmusic").run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$stateChangeError", function(event, next, previous, error) {
	if (error === "AUTH_REQUIRED") {
	    $location.path("/");
	}
    });
}]);

angular.module("ourmusic").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){
      $locationProvider.html5Mode(true);
      
      $stateProvider
	  .state('player', {
              url: '/player',
              templateUrl: 'client/player/view.ng.html',
              controller: 'PlayerCtrl'
	  });
      
      $urlRouterProvider.otherwise("/player");
}]);
