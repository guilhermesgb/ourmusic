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
    play: function(roomId) {
        check(roomId, String);
        var playRoom = PlayRooms.findOne({
            'roomId': roomId
        });
        if (!playRoom) {
            throw new Meteor.Error(404, "No such play room");
        }
        if (!playRoom.playerState) {
            throw new Meteor.Error(404, "Invalid player state");
        }
        check(playRoom.playerState.trackUri, String);
        check(playRoom.playerState.positionInMs, Number);

        if (Meteor.isCordova) {
            var token = "SPOTIFY_TOKEN";
            OurMusicPlugin.play(playRoom.playerState.trackUri,
                    playRoom.playerState.positionInMs, token,
                    function(newPlayerState) {
                PlayRooms.update({
                    _id: playRoom._id,
                },
                {
                    $set: {
                        "playerState.trackUri": newPlayerState.trackUri,
                        "playerState.playing": newPlayerState.playing,
                        "playerState.positionInMs": newPlayerState.positionInMs,
                        "playerState.durationInMs": newPlayerState.durationInMs
                    }
                });
            }, function(error) {
                throw new Meteor.Error(500, "Error playing track; " + error);
            });
        }
    },
    pause: function(roomId) {
        check(roomId, String);
        var playRoom = PlayRooms.findOne({
            'roomId': roomId
        });
        if (!playRoom) {
            throw new Meteor.Error(404, "No such play room");
        }
        if (!playRoom.playerState) {
            throw new Meteor.Error(404, "Invalid player state");
        }

        if (Meteor.isCordova) {
            OurMusicPlugin.pause(function(newPlayerState) {
                PlayRooms.update({
                    _id: playRoom._id,
                },
                {
                    $set: {
                        "playerState.trackUri": newPlayerState.trackUri,
                        "playerState.playing": newPlayerState.playing,
                        "playerState.positionInMs": newPlayerState.positionInMs,
                        "playerState.durationInMs": newPlayerState.durationInMs
                    }
                });
            }, function(error) {
                throw new Meteor.Error(500, "Error playing track; " + error);
            });
        }
    }
});
