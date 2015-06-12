if (Meteor.isCordova) {
  Meteor.startup(function () {
    OurMusicPlugin.login(function(message) {
        console.log(message);
	if(message == "PLAYER_INITIALIZED") {
	    Meteor.call("initialize");
	}
    }, function(error) {
        alert(error);
    });
  });
}
