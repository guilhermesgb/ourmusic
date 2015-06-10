if (Meteor.isCordova) {
  Meteor.startup(function () {
    OurMusicPlugin.login(function(message) {
        alert(message);
    }, function(error) {
        alert(error);
    });
  });
}
