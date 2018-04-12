import React from 'react';
import { observer } from "mobx-react"

import LoginForm from './loginForm'
import TicketForm from './ticketForm'

@observer
export default class App extends React.Component {

  render() {
    return (
    <div className="container">
        {this.props.store.apiKey == "" && this.props.store.err == "" ? (
          <LoginForm store={this.props.store}></LoginForm>
        ) : (
          <TicketForm store={this.props.store}></TicketForm>
        )}
    </div>);
  }

}
