import React, { Component } from 'react'
import DisplayListChannels from './displaychannels.jsx'
import {List,Image} from 'semantic-ui-react'
export default class DisplayListCh extends React.Component{

 constructor(props) {
        super(props);
        this.state = {    
        };
        this.handleGeneral=this.handleGeneral.bind(this);
        this.handle = this.handle.bind(this);
      }
      handle(data){
        this.setState({activeItem: data});
      }
      handleGeneral(e){
          e.preventDefault();
          this.props.handle({value:e.target.name,type:'channel'});
      }

      render(){
        let channelName=this.props.channelArray.map(function(data, index){
        return(
              <DisplayListChannels activeColorChan={this.props.activeColorChan} key={index} channelName={data} 
              handleItem={this.props.handle} activeUser={this.props.activeUser}
              handle = {this.handle} activeItem = {this.state.activeItem} />             
          );
      }.bind(this))
        return(
            <List>
             {channelName}
            </List>
          )
      }
} 