import React from 'react';
import Moment from 'moment';
import electron from 'electron';

export default class TicketItem extends React.Component {

    render(){

        Moment.locale('fr');

        return(
            <div onClick={this.openTicket.bind(this)} className="ticket">
                <span className="number">{this.props.ticket.number}</span>
                <span className="subject">{this.props.ticket.cdata__subject}</span>
                <span className="date">{Moment(this.props.ticket.created,"YYYY-MM-DD HH:mm:ss").format('DD/MM/YYYY')}</span>
            </div>
        );
    }

    openTicket(){
        const {shell} = electron;

        event.preventDefault();
        shell.openExternal(this.props.store.addr + "scp/tickets.php?number=" + this.props.ticket.number);
    }

}