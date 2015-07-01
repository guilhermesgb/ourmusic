/*
This was the idea but this b r e a k s everything.
Meteor.publish("play_rooms", function() {
    return PlayRooms.find({
        'users': {
            '$in': [Meteor.userId()]
        }
    });
});*/
Meteor.publish("play_rooms", function() {
    return PlayRooms.find({});
});

Meteor.methods({
    enterRoom: function(roomId) {
        var currentRoomId = Meteor.user().currentRoom;
        if (currentRoomId !== roomId) {
            PlayRooms.update({
                    'roomId': currentRoomId
                },
                {
                    '$pull': {
                        'users': Meteor.userId()
                    }
                }
            );
            PlayRooms.update({
                    'roomId': roomId
                },
                {
                    '$push': {
                        'users': Meteor.userId()
                    }
                }
            );
            Meteor.users.update({
                    _id: Meteor.userId()
                },
                {
                    '$set': {
                        'currentRoom': roomId
                    }
                }
            );
        }
    }
});
