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
    // This function is going to change a lot...
    // The ideia is to use this function for client recovery:
    //   - refresh_token
    //   - room
    //   - playerState
    //   - add inside a zookeeper group
    initialize: function(){
	Tracker.autorun(function(c){
	    if(!PlayRooms.findOne()){
		return;
	    }
	    c.stop();
	    var roomId = "GLOBAL";
            var playRoom = PlayRooms.findOne({
		'roomId': roomId
            });
	    if(playRoom && playRoom.playerState &&  playRoom.playerState.playing ){
		Meteor.call("play", roomId);
	    }
	});
    },
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
                    playRoom.playerState.positionInMs, token, successPlayStopCallback(roomId),
		function(error) {
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
            var token = "SPOTIFY_TOKEN";
            OurMusicPlugin.pause(token, successPlayStopCallback(roomId), 
		function(error) {
                    throw new Meteor.Error(500, "Error playing track; " + error);
		});
        }
    },
    skip: function(roomId) {
	check(roomId, String);
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
	    'playlistPos' : (playRoom.playlistPos + 1) % playRoom.playlist.length,
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
	    Meteor.call("skip",roomId);
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
