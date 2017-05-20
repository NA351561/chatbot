var express = require('express');
var router = express.Router();
var Chat= require('../models/chatSchema');

router.post('/getchat',function(req,res,next){
  var senderName=req.body.senderName;
  var receiverName=req.body.receiverName;
  Chat.findOne({
    $and: [
      { $or: [ { 'senderName': senderName }, { 'receiverName': senderName } ] },
      { $or: [ { 'senderName': receiverName }, { 'receiverName': receiverName } ] }
    ]
 },function(err,data){
    if(err){
      res.send(err);
    }
    else{
      res.send(data);
    }
  });
});


router.post('/updateCounter',function(req,res,next){
  var senderName=req.body.senderName;
  var receiverName=req.body.receiverName;
  var notificationCount= req.body.updateCounter;
  console.log("updateCounter....")
  Chat.findOne({
    $and: [
      { $or: [ { 'senderName': senderName }, { 'receiverName': senderName } ] },
      { $or: [ { 'senderName': receiverName }, { 'receiverName': receiverName } ] }
    ]
 },function(err,data){
    if(err){
      console.log("update error...")
      res.send(err);
    }
    else{
     if(data){
      console.log("inside update....")
          if(data.senderName === senderName){
            console.log("sender count....")
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
                  res.send(err)
                }
                else {
                  console.log('sender',data);
                  res.send(data)
                }
            })
          }
          else{
            console.log("receiver count....")
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
                  res.send(err)
                }
                else {
                  console.log('receiver',data);
                  res.send(data)
                }
            })
          }
        }
        else{
          console.log('no data');
          res.send("no data");
        }
      }
  });
});

module.exports = router;
