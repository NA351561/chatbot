import React, { Component } from 'react';
import { Form, Input, Button} from 'semantic-ui-react';
import ReactDOM from 'react-dom';
import Axios from 'axios';

export default class InputTextBox extends React.Component {
     constructor(props) {
        super(props);

        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleUserName = this.handleUserName.bind(this);
    }

    handleUserName(e){
      e.preventDefault();
      let message = ReactDOM.findDOMNode(this.refs.userName).value;
     // console.log("name: ",message)
      if(message.trim() === '') {
        return;
      }
      socket.emit('new user',message,function(data){
  				//data is true or false

  				if(data)
  				{
  					$('#nameForm').hide();
  					$('#textForm').show();
  				}
  		})
      //socket.emit('getSocketName','');
      ReactDOM.findDOMNode(this.refs.userName).value = '';
        document.getElementById("messageContent").scrollTop = document.getElementById("messageContent").scrollHeight;
    }


    handleUserInput(e) {
        e.preventDefault();
        let inputMessage = ReactDOM.findDOMNode(this.refs.userInput).value;
        if(inputMessage.trim() === '') {
          return;
        }
        ReactDOM.findDOMNode(this.refs.userInput).value = '';
        //console.log('msg: ',inputMessage);
        if(this.props.type === 'channel'){
          this.props.getSenderMessage({message: inputMessage})
        }
        else{
          let inputDate=new Date().toString();
          let senderMsg={senderName:this.props.communication.senderName,
            receiverName:this.props.communication.receiverName,msg:inputMessage,date:inputDate};
          this.props.getSenderMessage({name:this.props.communication.senderName,message:inputMessage,date:inputDate});
          socket.emit('sendMessage',senderMsg);
          /*socket.emit('notification',{senderName: this.props.communication.senderName,
          receiverName:this.props.communication.receiverName});*/
        }
        document.getElementById("messageContent").scrollTop = document.getElementById("messageContent").scrollHeight;
       }


  render() {

    return (
      <div >
        <Form id='nameForm' onSubmit={this.handleUserName}>
        	<input autoComplete="off" type="text" id="inputbox"
            name='userName' ref='userName' placeholder='Enter Your Name...' />
        </Form>

        <Form id='textForm' onSubmit={this.handleUserInput}>
          <input autoComplete="off" type='text' id="inputbox"
            name='userInput' ref='userInput' placeholder='Type Your Message Here...'  />
        </Form>
      </div>

    )
  }
}
