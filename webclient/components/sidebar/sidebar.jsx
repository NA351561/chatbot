import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Sidebar, Segment,Form, Button, Menu, Icon} from 'semantic-ui-react';
import { List, Image,Input,Grid } from 'semantic-ui-react';
import {  Header, Modal } from 'semantic-ui-react';
import SideBarContent from './sidebarcontent.jsx';
import InputTextBox from './inputTextBox.jsx';
import DisplayListUs from './DisplayListUs.jsx';
import DisplayListCh from './displayListCh.jsx';
import './sidebar.css';
import Axios from 'axios';
export default class SidebarMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          activeItem:'',
          chatType:'',
          channelArray:[],
          userNames:[],
          communication:{},
          socketName:'',
          senderMessage:{},
          chatDetails:[],
          channelMsg: {},
          notification: {},
          modalSwitch:false,
          activeColorChan:'',
          activeColorUser:''
        };
        this.handle=this.handle.bind(this);
        this.getSenderMessage=this.getSenderMessage.bind(this);
        this.getChatHistory = this.getChatHistory.bind(this);
        this.getAllChannels = this.getAllChannels.bind(this);
        this.modalOn = this.modalOn.bind(this);
        this.modalOff = this.modalOff.bind(this);
        this.onSubmitChannelName = this.onSubmitChannelName.bind(this);
        this.handleChannel = this.handleChannel.bind(this);
    }
    modalOn(){
      this.setState({modalSwitch:true})
    }
    modalOff(){
      this.setState({modalSwitch:false})
    }

onSubmitChannelName(e){
  e.preventDefault();

  let message = ReactDOM.findDOMNode(this.refs.channelName).value;
  if(message.trim() === '') {
          return;
        }
  ReactDOM.findDOMNode(this.refs.channelName).value = '';

    Axios({
                url: '/channel/addNewChannel',
                method: 'post',
                data: {
                    channelName:message
                }
            }).then(function(response) {
               // console.log("axios response in adding new channel is->",response);
                this.getAllChannels();

            }.bind(this)).catch(function(error) {
              console.log(error);
              }.bind(this));
    this.setState({modalSwitch:false});
    }

    handleChannel(data){
     socket.emit('change_channel',{prevChannel:this.state.activeItem,currentChannel:data.value});
    // console.log("Handle channal is called.....",data.type);

     this.setState({activeItem:data.value,chatType:data.type,activeColorUser:"black",activeColorChan:"green"});
     Axios({
                url: '/channel/getAllMessagesChannel',
                method: 'post',
                data: {
                   channelName:data.value
                }
            }).then(function(response) {
               // console.log("axios response in getting all messaages of a channel new message is->",response.data.allmsgs);
                this.setState({chatDetails:response.data.allmsgs});

            }.bind(this)).catch(function(error) {
              console.log(error);
              }.bind(this));

  }
    handle(data){
      socket.emit('change_channel',{prevChannel:this.state.activeItem,currentChannel:data.value});
      this.setState({activeItem:data.value,chatType:data.type,activeColorChan:"black", activeColorUser:"green"});
   //   console.log("Handle method is called for user..",data.type);
      this.getChatHistory(data.value);
    }
    getSenderMessage(senderMsg){
      if(this.state.chatType == 'channel'){
        let msgArray=this.state.chatDetails;
        let date=new Date();
        msgArray.push({date:date,message:senderMsg.message,
          senderName:this.state.socketName});
        this.setState({chatDetails:msgArray});
        socket.emit('send_to_channel',{channelName:this.state.activeItem,
          newMsg:{date:date,message:senderMsg.message,
            senderName:this.state.socketName}});
       // socket.emit('notification',{channelName:this.state.activeItem});
      }
      else{
        var tempArr = this.state.chatDetails
        tempArr = tempArr.concat(senderMsg);
        this.setState({chatDetails: tempArr});
      }

    }
    getAllChannels(){
   Axios({
                url: '/channel/getAllChannels',
                method: 'post'
            }).then(function(response) {
              //  console.log("all channels from database are: ",response.data.allChannels);
                socket.emit('display_channels',response.data.allChannels);
            }.bind(this)).catch(function(error) {
              console.log(error);
              }.bind(this));
}
    componentDidMount(){
      //creating default general channel
      Axios({
                url: '/channel/createChannelsArray',
                method: 'post',

            }).then(function(response) {
               this.getAllChannels();
                //console.log("axios response in adding new channel is->",response);
            }.bind(this)).catch(function(error) {
              console.log(error);
              }.bind(this));
      let data = ({value:'General',type:'channel'});
      this.handleChannel(data);
      socket.on('channels',(channelArray)=>{
                this.setState({channelArray:channelArray});
                })

      socket.on('getSocketName',(data)=>{
        this.setState({socketName:data.socketName});
      })

      socket.on('usernames', (data) => {
      this.setState({userNames:data});
       })

       socket.on('sendSecondUserName',(data)=>{
 				this.setState({communication:data});
 			})

      socket.on("display_all_msgs", (data)=>{
        let msgArray=this.state.chatDetails;
        msgArray.push({date:data.date,message:data.message,senderName:data.senderName});
        this.setState({chatDetails:msgArray});
     })


      socket.on('recieverMessage',(data)=> {

        if(this.state.chatType==='chat')
        {
          var tempArr= this.state.chatDetails;
          tempArr = tempArr.concat({name:data.senderName,message:data.msg,date:data.date});
  				this.setState({chatDetails:tempArr});
         }
		  });
    }

    getChatHistory(data){
         Axios({
           url: '/chat/getChat',
           method: 'POST',
           data:{
             senderName:this.state.socketName,
             receiverName:data
           }
       }).then(function(response) {
        // console.log('getting chat history from db..',response.data);
         if(response.data.chat)
         {
           this.setState({chatDetails:response.data.chat});
         }
          else {
            this.setState({chatDetails:[]});
          }
       }.bind(this)).catch(function(error) {
           console.log(error);
       }.bind(this));

    }
  render() {
    return (
    <div>
      <Sidebar id='sideBarStyle' as={Menu} animation='push' width='thin' visible={true} icon='labeled' vertical inverted>
          <br />
          <Modal open={this.state.modalSwitch} trigger={<Button onClick={this.modalOn}>Create New Channel</Button>}>
            <Header icon='archive' content='Create New Channel' />
            <Modal.Content>
              <Segment inverted>
                <Form id='channelForm' onSubmit={this.onSubmitChannelName}>
                  <input autoComplete="off" type='text' id="channelBox"
                    name='channelName' ref='channelName' placeholder='Type Channel Name Here...'  />
                </Form>
                <br/>
                <Button color='green' onClick={this.onSubmitChannelName} style={{marginLeft:'600px'}}>
                      <Icon name='sign in' /> Create
                </Button>
                <Button color='red' onClick={this.modalOff}>
                      <Icon name='close' /> Close
                </Button>
              </Segment>
            </Modal.Content>
          </Modal>
           <h3>Channels</h3>

            <DisplayListCh activeColorChan={this.state.activeColorChan} channelArray={this.state.channelArray}
            handle={this.handleChannel} activeUser={this.state.activeItem}/>
          <br/><br/>
           <h3>Online Users</h3>
          <DisplayListUs activeColorUser={this.state.activeColorUser} allUsers={this.state.userNames} handle={this.handle}
             activeUser={this.state.activeItem} socketName={this.state.socketName}/>
      </Sidebar>

      <div id="messageContent">
        <SideBarContent chatHistory={this.state.chatDetails} activeUser={this.state.activeItem} socketName={this.state.socketName} type={this.state.chatType} />
      </div>
      <div>
            <InputTextBox getSenderMessage={this.getSenderMessage} communication={this.state.communication}
            type={this.state.chatType}/>
      </div>
    </div>
    )
  }
}
