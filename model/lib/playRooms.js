PlayRooms = new Mongo.Collection("play_rooms");

PlayRooms.allow({
    insert: function(userId, playRoom) {
        return true;
    },
    update: function(userId, playRoom, fields, modifier) {
        return true;
    },
    remove: function(userId, playRoom) {
        return true;
    }
});

Meteor.methods({
    play: function(roomId, playerState) {
        check(roomId, String);
        if (!playerState) {
            throw new Meteor.Error(404, "Invalid player state");
        }
        check(playerState.trackUri, String);
        check(playerState.positionInMs, Number);
        var playRoom = PlayRooms.findOne({
            'roomId': roomId
        });
        if (!playRoom) {
            throw new Meteor.Error(404, "No such play room");
        }
        var token = "SPOTIFY_TOKEN";
        OurMusicPlugin.play(playerState.trackUri,
                playerState.positionInMs, token, function(newPlayerState) {
            PlayRooms.update(playRoom.id, {
                $set: {
                    playerState: newPlayerState
                }
            });
        }, function(error) {
            throw new Meteor.Error(404, "Error playing track; " + error);
        });
    }
});