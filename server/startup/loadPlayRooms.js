console.log("About to define GLOBAL playRoom");
if (PlayRooms.find().count() === 0) {
    var playRooms = [
        {
            'roomId': 'GLOBAL',
            'playerState': {
                'playing': false,
                'trackUri': 'spotify:track:2TpxZ7JUBn3uw46aR7qd6V',
                'positionInMs': 0,
                'durationInMs': 36000
            },
            'playlist': null
        }
    ];
    for (var i=0; i<playRooms.length; i++) {
        PlayRooms.insert(playRooms[i]);
    }
    console.log("Defined GLOBAL playRoom");
}
