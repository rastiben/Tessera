import React from 'react';

import TicketItem from './ticketItem';

export default class TicketModal extends React.Component {

    render(){

        const tickets = this.props.tickets.map((e,index) => 
            <TicketItem key={index} store={this.props.store} ticket={e}></TicketItem>
        );

        return(
            <div className="modal tickets">
                <div className="list">
                    {tickets}
                </div>
                <div className="buttons">
                    <div className="button">
                        <button type="button" onClick={() => this.props.toggleModal(null,true)} className="enabled">Continuer</button>
                    </div>
                    <div className="button">
                        <button type="button" onClick={this.props.toggleModal} className="cancel">Doublon</button>
                    </div>
                </div>
            </div>
        );
    }

}