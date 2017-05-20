import React, { Component } from 'react'
import { List, Image, Label } from 'semantic-ui-react';
import Axios from 'axios';
import './sidebar.css';
export default class DisplayListChannels extends React.Component {
   constructor(props) {
       super(props);
       this.state = {
         activeItem: '',
         notification: false
       };
       this.handleItemClick=this.handleItemClick.bind(this);
   }
   handleItemClick(e){
     e.preventDefault();
     let count = '';
     this.setState({notification:count});
     this.props.handle(e.target.name);
     this.props.handleItem({value:e.target.name,type:'channel'});
     socket.emit('changeNotification',{channelName: this.props.channelName.key});
     document.getElementById("messageContent").scrollTop = document.getElementById("messageContent").scrollHeight;
  }
  componentDidMount(){
      socket.on('channelcount', (data) => {
      if(data.channelName === this.props.channelName.key){
          if(this.props.activeUser !== data.channelName){
            this.setState({notification: data.count});
          }
          else{
             let count = '';
             this.setState({notification: count});
          }

        }

      })
   }
  render() {
      const activeItem  = this.props.activeItem;
      let name = this.props.channelName.key;
       return (
        <List.Item id="sidebar">
          <List.Content >
            <Label as='a' id="label1" color={(activeItem===name)?this.props.activeColorChan:'black'} active={activeItem===name}
              name={this.props.channelName.key} onClick={this.handleItemClick}>
             <Image avatar spaced='right' src={require('../images/myprofilepic.jpg')} />
              {this.props.channelName.key}
              <Label.Detail>{this.state.notification}</Label.Detail>
            </Label>
          </List.Content>
        </List.Item>
      );
   }
}
