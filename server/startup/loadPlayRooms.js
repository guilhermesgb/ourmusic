console.log("About to define GLOBAL playRoom");
PlayRooms.remove({});
Meteor.users.remove({});
if (PlayRooms.find().count() === 0) {
    var playRooms = [
        {
            'roomId': 'GLOBAL',
            'playerState': {
                'playing': false,
                'trackUri': 'spotify:track:6q9CRTF8dyABIcKj7bCJwf',
                'positionInMs': 0,
                'durationInMs': 36000
            },
            'playlist': ['spotify:track:6q9CRTF8dyABIcKj7bCJwf', "spotify:track:0eGsygTp906u18L0Oimnem"],
	    'playlistPos': 0
        }
    ];
    for (var i=0; i<playRooms.length; i++) {
        PlayRooms.insert(playRooms[i]);
    }
    console.log("Defined GLOBAL playRoom");
}
