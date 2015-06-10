Meteor.publish("play_rooms", function() {
    return PlayRooms.find();
});
