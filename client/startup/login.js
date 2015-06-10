if (Meteor.isCordova) {
  Meteor.startup(function () {
    OurMusicPlugin.login(function(message) {
        console.log(message);
    }, function(error) {
        alert(error);
    });
  });
}
