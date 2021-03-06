angular.module('ourmusic', [
    'angular-meteor',
    'ui.router',
    'ngMaterial'
]).config(["$mdThemingProvider", function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('deep-orange')
        .accentPalette('green');
    }
]);

function onReady() {
    angular.bootstrap(document, ['ourmusic']);
}

if (Meteor.isCordova) {
    angular.element(document).on("deviceready", onReady);
}
else {
    angular.element(document).ready(onReady);
}
