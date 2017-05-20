var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var channelSchema=mongoose.Schema({
/*allChannels: {
      type: Array
    }
*/
    key:String,

    value:[{
		    senderName:String,
		    message:String,
		    date:String
  }],

  usersinroom:[{username:String,socketId:String}]

});

module.exports=mongoose.model('channelCollection',channelSchema);
