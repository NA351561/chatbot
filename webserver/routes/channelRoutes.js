var express = require('express');
var router = express.Router();
var Channel= require('../models/channelSchema')

router.post('/createChannelsArray',function(req,res,next){
	Channel.findOne({'key':'General'},function(err,data){
			if(err)
			{
				throw err;
			}
			else
			{
				if(!data)
				{
					var newChannel=new Channel({key:'General'});
					newChannel.save(function(err,data)
					{
						if(err)
						{
							throw err;
						}
						else{
							res.send("General Created in database");
						}
					})
				}
				else
				{
					res.send("General Channel already there");
				}
			}
	})
})

router.post('/addNewChannel',function(req,res,next){
	
	Channel.findOne({'key':req.body.channelName},function(err,data){
			if(err)
			{
				throw err;
			}
			else
			{
				if(!data)
				{
					var newChannel=new Channel({key:req.body.channelName});
					newChannel.save(function(err,data)
					{
						if(err)
						{
							throw err;
						}
						else{
							res.send("New channel Created in database");
						}
					})
				}
				else
				{
					res.send(req.body.channelName+ " channel already Exists");
				}
			}
	})

})

/*router.put('/addNewMessageChannel', function(req, res, next) {
  
 
  	  var senderName=req.body.senderName;
	  var channelName=req.body.channelName;
	  var message=req.body.message;
	  var date=new Date().getTime();
 
		



      Channel.update({key:channelName},{$push:{
             value:{senderName:senderName,
               message:message,
               date:date
               }
           }},function(err,data){
             if(err){
               res.send(err);
             }
             else {
               res.send({msg:"Message added successfully in channel",data:data});
             }
           })
  
  
  
})*/


router.post('/getAllMessagesChannel',function(req,res,next){
	


	Channel.find({'key':req.body.channelName},function(err,data){
			
		if(err)
		{
			console.log("user clicked");
			throw err;
		}
		else
		{
			if(data.length>0)
			res.send({msg:"I got all messages from  database",allmsgs:data[0].value})		
		}
	})

})

router.post('/getAllChannels',function(req,res,next){
	
	
	Channel.find({},function(err,data){
			
		if(err)
		{
			throw err;
		}
		else
		{	
			res.send({msg:"I got all channels from  database",allChannels:data})		
		}
	})

})

module.exports = router;