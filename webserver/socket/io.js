var Channel= require('../models/channelSchema');
var Chat= require('../models/chatSchema');
module.exports=function(io){
var users={};
var receiver='';
var notificationCount=0;
var channelNotification=0;
  io.on('connection', function(socket){
    console.log('a user connected');
    notificationCount = 0;
    socket.join('General');
        socket.on('change_channel',function(data){
             //socket.emit('change_color',data.prevState);
            socket.leave(data.prevChannel);
            socket.join(data.currentChannel);
    });
    socket.on('display_channels',function(channelArray){
             io.sockets.emit('channels',channelArray);
              });
   
    socket.on('send_to_channel',function(data){

              var senderName = data.newMsg.senderName;
              var channelName = data.channelName;
              var message = data.newMsg.message;
              var date = data.newMsg.date;

              Channel.update({key:channelName},{$push:{
                     value:{senderName:senderName,
                       message:message,
                       date:date
                       }
                   }},function(err,data){
                     if(err){
                       console.log(err);
                     }
                     else {
                       console.log("Message added successfully in channel");
                     }
                   })
              channelNotification ++;   
              socket.broadcast.to(channelName).emit('channelcount',{channelName:channelName,count:channelNotification});
              socket.broadcast.to(channelName).emit('display_all_msgs',{channelName:channelName,message:message,date:date,senderName:senderName});
             
        });

    socket.on('new user',function(data,callback){
      //if user is already present
      console.log('new user',data);
	     if(data in users)
	      {
		        callback(false);
	      }
	     else{

		       callback(true);
		        //storing nickname of each user in its own socket
		        socket.nickname=data;
		        users[socket.nickname]=socket;
		        /*nicknames.push(socket.nickname);*/
		        io.sockets.emit('usernames',Object.keys(users));
            socket.emit('getSocketName',{socketName:socket.nickname})
	         }
         });
         socket.on('getSecondUserName',function(data){
           socket.emit('sendSecondUserName',{senderName:socket.nickname,receiverName:data});
         });


         socket.on('sendMessage',function(data){
             var senderName=data.senderName;
             var receiverName=data.receiverName;
             var message= data.msg;
             var date=new Date().toString();
             notificationCount++;
                Chat.findOne({
                   $and: [
                     { $or: [ { 'senderName': senderName }, { 'receiverName': senderName } ] },
                     { $or: [ { 'senderName': receiverName }, { 'receiverName': receiverName } ] }
                   ]
                },function(err,data){
                  if(err)
                  {
                    throw err;
                  }
                   else {
                     if(data){
                       Chat.findOneAndUpdate({
                         $and: [
                           { $or: [ { 'senderName': senderName }, { 'receiverName': senderName } ] },
                           { $or: [ { 'senderName': receiverName }, { 'receiverName': receiverName } ] }
                         ]
                      },{$push:{
                        chat:{name:senderName,
                          message:message,
                          //date:date
                          }
                      }},function(err,data){
                        if(err){
                          console.log(err);
                        }
                        else {
                          console.log(data);
                        }
                      })
                       if(data.senderName === senderName){
                        Chat.findOneAndUpdate({
                         $and: [
                           { $or: [ { 'senderName': senderName }, { 'receiverName': senderName } ] },
                           { $or: [ { 'senderName': receiverName }, { 'receiverName': receiverName } ] }
                         ]
                        },{$set:{
                          senderCount: notificationCount
                        }},function(err,data){
                          if(err){                    
                            console.log(err);
                          }
                           else {
                            console.log(data);
                          }
                        })
                       }
                       else{
                         Chat.findOneAndUpdate({
                         $and: [
                           { $or: [ { 'senderName': senderName }, { 'receiverName': senderName } ] },
                           { $or: [ { 'senderName': receiverName }, { 'receiverName': receiverName } ] }
                         ]
                        },{$set:{
                          receiverCount: notificationCount
                        }},function(err,data){
                          if(err){                    
                            console.log(err);
                          }
                           else {
                            console.log(data);
                          }
                        })
                       }
                     }
                     else{
                       var chat=new Chat({
                         senderName:senderName,
                         receiverName:receiverName,
                         chat:{name:senderName,
                           message:message,
                           //date:date
                           },
                         senderCount: notificationCount 
                       });
                       chat.save(function(err,data){
                           if(err)
                           {
                             console.log(err);
                         }
                         else {
                           console.log(data);
                         }
                       })
                     }
                   }
            });
           users[receiverName].emit('count',{sender:senderName,count:notificationCount}) 
           users[receiverName].emit('recieverMessage',data);           
      });
  
     /*socket.on('notification',function(data){
      if(data.senderName){
           notificationCount++;
           users[receiverName].emit('count',{sender:senderName,count:notificationCount}); 
      }
      else{
        channelNotification ++;   
        socket.broadcast.to(data.channelName).emit('channelcount',{channelName:data.channelName,count:channelNotification}) 
      }
      });*/

    socket.on('changeNotification',function(data){
      if(data.senderName)
          notificationCount=0;
      else
          channelNotification = 0;
      });
    
      //while disconnecting users should be removed
    socket.on('disconnect',function(data){
      if(!socket.nickname) return;
      delete users[socket.nickname];
      io.sockets.emit('usernames',Object.keys(users));
      });

  });


}
