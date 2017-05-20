import React from 'react';
import {
  Menu,
  List,
  Image,
  Label,
  Icon
} from 'semantic-ui-react';
import Axios from 'axios';
import './sidebar.css'
export default class DisplayListUsers extends React.Component {
   constructor(props) {
       super(props);
       this.state = {
          notification : '',
          activeItem: ''
       };
       this.handleItemClick=this.handleItemClick.bind(this);
       this.updateNotification=this.updateNotification.bind(this);
       this.getNotification=this.getNotification.bind(this);
   }
   handleItemClick(e,obj){
     e.preventDefault();
     this.props.handle(e.target.name);
     socket.emit('getSecondUserName',e.target.name);
     this.props.handleItem({value:e.target.name, type:'chat'});
     this.updateNotification(e.target.name);
     let count = '';
     this.setState({notification: count});
     socket.emit('changeNotification',{senderName: this.props.username});
     document.getElementById("messageContent").scrollTop = document.getElementById("messageContent").scrollHeight;

   }
   updateNotification(sender){
    let counter=0;
    let count = '';
    if(this.state.notification !== ''){
    socket.emit('changeNotification',{senderName: this.props.username});
    console.log("update");
    Axios({
           url: '/chat/updateCounter',
           method: 'POST',
           data:{
             senderName:sender,
             receiverName:this.props.socketName,
             updateCounter: counter
           }
       }).then(function(response) {
          this.setState({notification: count});
          console.log("Updated sucessfully... ",response);
          this.getNotification();
       }.bind(this)).catch(function(error) {
           console.log(error);
       }.bind(this));
     }
  }
  getNotification(){
    console.log("props username", this.props.username)
     Axios({
           url: '/chat/getChat',
           method: 'POST',
           data:{
             senderName:this.props.username,
             receiverName:this.props.socketName
           }
       }).then(function(response) {
         if(response.data){
          if(response.data.senderName === this.props.username && response.data.senderCount !==0){
            console.log("notification history1",response.data)
            this.setState({notification: response.data.senderCount})
            console.log("notification1...",this.state.notification)
        }
          else if(response.data.receiverName === this.props.username && response.data.receiverCount !==0){
            console.log("notification history2",response.data)
            this.setState({notification: response.data.receiverCount})
            console.log("notification2...", this.state.notification)
          }
         }
       }.bind(this)).catch(function(error) {
           console.log(error);
       }.bind(this));

  }
   componentDidMount(){
    this.getNotification();
      socket.on('count', (data) => {
      if(data.sender === this.props.username ){
        if(this.props.activeUser !== data.sender){
          this.setState({notification: data.count});
          console.log("notification3...",this.state.notification)
        }
        else{
          let count = '';
          this.setState({notification: count});
          console.log("notification4...",this.state.notification)
          this.updateNotification(this.props.activeUser);
        }
      }
      })
          //this.getNotification();
    }

   render() {
    //console.log("output..",this.state.notification)
    const activeItem  = this.props.activeItem;
    let name = this.props.username;
       return (

         <List.Item id="sidebar">
          <List.Content>
          <Label as='a' id="label1" color={(activeItem===name)?this.props.activeColorUser:'black'} active={activeItem===name}
            name={this.props.username} onClick={this.handleItemClick} >
          <Icon color='white' name='dot circle' />
            {this.props.username}
          <Label.Detail>{this.state.notification}</Label.Detail>
          </Label>
          </List.Content>
        </List.Item>
       );
   }
}
