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
    play: function(playbackCallbackError) {
        var roomId = Meteor.user().currentRoom;
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
	    var token = Meteor.user().accessToken;
            OurMusicPlugin.play(playRoom.playerState.trackUri,
                    playRoom.playerState.positionInMs, token, successPlayStopCallback(roomId),
		    function(error) {
			playbackError(error,playbackCallbackError);
		    });
        }
    },
    pause: function(playbackCallbackError) {
        var roomId = Meteor.user().currentRoom;
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
	    var token = Meteor.user().accessToken;
            OurMusicPlugin.pause(token, successPlayStopCallback(roomId), 
		function(error) {
		    playbackError(error,playbackCallbackError);
		});
        }
    },
    skip: function() {
        var roomId = Meteor.user().currentRoom;
	var playRoom = PlayRooms.findOne({
	    'roomId': roomId
	});
	if (!playRoom) {
            throw new Meteor.Error(404, "No such play room");
        }
	if (!playRoom.playlist) {
	    throw new Meteor.Error(404, "No such playlist");
	}
	PlayRooms.update({
	    _id: playRoom._id,
	},{$set : {
	    'playlistPos': (playRoom.playlistPos + 1) % playRoom.playlist.length,
	    "playerState.trackUri": playRoom.playlist[(playRoom.playlistPos + 1) % playRoom.playlist.length],
	    "playerState.positionInMs": 0
	}});
	Meteor.call("play",roomId);
    }
});

function successPlayStopCallback(roomId){
    return function(newPlayerState) {
	var playRoom = PlayRooms.findOne({
	    'roomId': roomId
	});
	if(!playRoom){
	    throw new Meteor.Error(404, "No such play room");
	}
	var playerState = playRoom.playerState;
	if (!playRoom.playerState) {
	    throw new Meteor.Error(404, "Invalid player state");
	}
	if (newPlayerState.event === "TRACK_END") {
	    Meteor.call("skip");
	    return;
	}
	PlayRooms.update({
	    _id: playRoom._id,
	},{ 
	    $set: {
		"playerState.playing": newPlayerState.playing,
		"playerState.positionInMs": Math.max(newPlayerState.positionInMs, playerState.positionInMs),
		"playerState.durationInMs": newPlayerState.durationInMs
	    }
	});
    }   
};

playbackError = function(error, playbackCallbackError) {
    if (error === "TOKEN_UNAUTHORIZED") {
	Meteor.logout();
	playbackCallbackError(error);
    }
    if (error === "TRACK_UNAVAILABLE"){
	Meteor.call("skip");
    }
    if (error === "UNKNOWN") {
	playbackCallbackError(error);
    }
};
