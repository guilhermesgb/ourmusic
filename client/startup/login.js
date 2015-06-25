if (Meteor.isCordova) {
  Meteor.startup(function () {
    Session.setDefault("playerInitialized", false);
  });
}
