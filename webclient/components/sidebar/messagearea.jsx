import React, { Component } from 'react'
import {
  List,
  Image,
  Label,
  Divider,
  Message,
  Popup,
  Grid
      } from 'semantic-ui-react'
import './sidebar.css'
import moment from 'moment';

export default class MessageArea extends React.Component {
  constructor(props) {
      super(props);

  }


  render() {
    let messageDate=new Date(this.props.messageDetails.date).toLocaleString().split(',');
    messageDate[1]=messageDate[1].replace(/:\d+ /, ' ');

    return (
    <div>
    {(this.props.messageDate)?
        (<div id='dateDisplay'>
          <Message>
            <Divider horizontal>
              {moment(this.props.messageDate, 'M/D/Y').format('ll')}
            </Divider>
          </Message>
        </div>):
        (<div></div>)
      }
      <Popup
          trigger={(this.props.type === 'channel')?
           <Grid>
              {(this.props.socketName === this.props.messageDetails.senderName)?
               <Grid.Column  width={5} id='messageOfGroupSender'>
              <List>
                 <List.Item>
                  <Image avatar src={require('../images/myprofilepic.jpg') } />
                  <List.Content>
                    <List.Header as='a'>
                    <Label color='blue'>{this.props.messageDetails.senderName.toUpperCase()}
                        <Label.Detail>{messageDate[1]}</Label.Detail>
                    </Label>
                    </List.Header>
                     <br />
                         <List.Description id="displayMessage">
                            {this.props.messageDetails.message}
                         </List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>:
            <Grid.Column  width={5} id='messageOfReceiver'>
              <List>
                 <List.Item>
                  <Image avatar src={require('../images/myprofilepic.jpg') } />
                  <List.Content>
                   <List.Header as='a'>
                    <Label color='orange'>{this.props.messageDetails.senderName.toUpperCase()}
                        <Label.Detail>{messageDate[1]}</Label.Detail>
                    </Label>
                    </List.Header>
                     <br />
                         <List.Description id="displayMessage">
                            {this.props.messageDetails.message}
                         </List.Description>
                  </List.Content>
                </List.Item>
              </List>
            </Grid.Column>
          }

          </Grid>:

          <Grid>
          {(this.props.activeUser===this.props.messageDetails.name)?
            <Grid.Column width={5} id='messageOfReceiver'>
              <List>
                {(this.props.activeUser===this.props.messageDetails.name)||(this.props.socketName===this.props.messageDetails.name)?
                <List.Item>
                  <Image avatar src={require('../images/myprofilepic.jpg') } />
                    <List.Content>
                      <List.Header as='a'>
                       <Label color='orange'>{this.props.messageDetails.name.toUpperCase()}
                         <Label.Detail>{messageDate[1]}</Label.Detail>
                       </Label>
                      </List.Header>
                      <br />
                      <List.Description id="displayMessage">{this.props.messageDetails.message}</List.Description>
                    </List.Content>
                </List.Item>:''
              }
              </List>
            </Grid.Column>:
            <Grid.Column>
              {(this.props.socketName===this.props.messageDetails.name)?
                 <Grid.Column  width={5} id='messageOfSender'>
                  <List >
                    {(this.props.activeUser===this.props.messageDetails.name)||(this.props.socketName===this.props.messageDetails.name)?
                    <List.Item >
                      <Image avatar src={require('../images/myprofilepic.jpg') } />
                        <List.Content>
                          <List.Header as='a'>
                            <Label color='blue'>{this.props.messageDetails.name.toUpperCase()}
                              <Label.Detail>{messageDate[1]}</Label.Detail>
                            </Label>
                          </List.Header>
                          <br />
                          <List.Description id="displayMessage">{this.props.messageDetails.message}</List.Description>
                        </List.Content>
                    </List.Item>:''
                  }
                  </List>
                </Grid.Column>:''
              }
              </Grid.Column>
            }
            </Grid>
          }
          content={moment(messageDate[0], 'M/D/Y').format('llll').slice(0,17)}
          basic
          position='top center'
        />
    </div>
    )
  }
}
