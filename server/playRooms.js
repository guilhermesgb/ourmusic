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
        var playRoom = PlayRooms.find({
                'roomId': roomId
            }
        );
        var leader = playRoom.leader;
        if ((leader == null) || !(leader in playRoom.users)) {
            PlayRooms.update({
                    'roomId': roomId
                },
                {
                    '$set': {
                        'leader': Meteor.userId()
                    }
                }
            );
        }
        var playRoom2 = PlayRooms.find({
                'roomId': roomId
            }
        );
        console.log("New LEADER:", playRoom2.leader);
    }
});
