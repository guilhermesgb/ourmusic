Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {"spotifyProfile": 1,"accessToken": 1, "lastUpdate":1,"tokenExpiresIn":1}});
  } else {
    this.ready();
  }
});


Meteor.methods({
    authenticateSpotifyCode: function(code,redirect_uri) {	
	try{
	    var result = HTTP.call("POST", "https://accounts.spotify.com/api/token", 
		           {"params": {"grant_type": "authorization_code", "code":code, "redirect_uri":redirect_uri,
			   "client_id":"a86d7ad4269d4a6ea18b167c1f5b811d","client_secret":"43e9b343700a4d028bb6297852a1ac2c"}});
	    console.log(result.statusCode);
	    if(result.statusCode == 200){
		var accessToken = result.data.access_token;
		var refreshToken = result.data.refresh_token;
		var expiresIn = result.data.expires_in;
		var result = HTTP.call("GET", "https://api.spotify.com/v1/me",{"headers":{"Authorization":"Bearer "+accessToken}});
		if(result.statusCode == 200){
		    console.log(result.data.id);
		    var username = result.data.id;
		    var spotifyProfile = result.data;
		    var user = Meteor.users.findOne({
			'username': username
		    });
		    var userId = null;
		    if(!user){
			userId = Accounts.createUser({"username":username,"password":code});
			console.log("Cadastrou "+userId);
		    } else {
			userId = user._id;
			Accounts.setPassword(userId,code);
			console.log("Mudou senha de",username);
		    }
		    Meteor.users.update({_id:userId}, { $set:{"spotifyProfile":spotifyProfile, "accessToken":accessToken,
							     "refreshToken":refreshToken, "lastUpdate":(new Date()),
							      "tokenExpiresIn":expiresIn}} )
		    return username;
		}
	    }
	    return null;
	} catch (e) {
	    console.log(e);
	    return null;
	}
    }
});
