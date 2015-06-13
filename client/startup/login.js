if (Meteor.isCordova) {
  Meteor.startup(function () {
    Session.setDefault("playerInitialized", false);
    OurMusicPlugin.login(function(message) {
        console.log("Login: " + message);
	if(message == "PLAYER_INITIALIZED") {
	    Session.set("playerInitialized", true);
	} else {
	    Session.set("authToken", message);
	}
    }, function(error) {
        alert(error);
    });
  });
}
