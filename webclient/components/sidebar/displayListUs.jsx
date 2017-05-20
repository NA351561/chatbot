import React, { Component } from 'react'
import DisplayListUsers from './displayListUsers.jsx'
import {List} from 'semantic-ui-react'
export default class DisplayListUs extends React.Component{
 constructor(props) {
        super(props);
        this.state={
          activeItem : ''
        }
        this.handle = this.handle.bind(this);
      }
      handle(data){
        this.setState({activeItem: data});
      }


      render(){
        let allUsers=this.props.allUsers.map(function(data, index){
          if(data!==this.props.socketName)
          {
            return( 
                  <DisplayListUsers key={index} activeColorUser={this.props.activeColorUser} username={data} 
                  handleItem={this.props.handle} activeUser={this.props.activeUser} 
                  handle={this.handle} activeItem={this.state.activeItem}
                  socketName={this.props.socketName} />
              );
          }

      }.bind(this))
        return(
            <List>
             {allUsers}
            </List>
          )
      }
}
