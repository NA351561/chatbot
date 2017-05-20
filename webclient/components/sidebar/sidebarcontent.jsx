import React from 'react';
import ChatMessage from './chatMessage.jsx';
export default class LeftMenuContent extends React.Component {
    render(){
			return(
				<div>
					<ChatMessage chatHistory={this.props.chatHistory}  activeUser={this.props.activeUser}
						socketName={this.props.socketName} type={this.props.type} />
				</div>
			);
    }
}
