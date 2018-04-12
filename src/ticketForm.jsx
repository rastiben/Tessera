import React from 'react';
import {AsyncTypeahead} from 'react-bootstrap-typeahead';
import electron from 'electron';

import Users from './users';
import User from './user';
import Ticket from './ticket';
import Modal from './modalForm';
import TicketModal from './modalTicket'

export default class TicketForm extends React.Component {

    users = null;
    ticket = null;

    constructor(props){
        super(props);

        this.users = new Users(this.props.store);
        this.ticket = new Ticket(this.props.store);

        this.state = {
            allowNew: false,
            isLoading: false,
            createTicket: false,
            createTicketMessage: "Création du ticket en cours",
            created: false,
            multiple: false,
            selected: [],
            options: [],
            tickets: [],
            subject:"",
            comments:"",
            modal:false,
            ticketModal:false
        }
    }

    render(){

        const classBtn = this.formIsValid() ? "enabled" : "disabled";

        const subject = this.state.subject != "" ? "valid" : "invalid";
        const comments = this.state.comments != "" ? "valid" : "invalid";

        const created = this.state.created ? "check" : "";
        const modal = this.state.modal ? "active" : "";

        const ticketModal = this.state.tickets.length > 0 ? <TicketModal store={this.props.store} tickets={this.state.tickets} toggleModal={this.toggleTicketModal.bind(this)}></TicketModal> : "";

        const ticketsStyle = {
            display: this.state.tickets.length > 0 ? "block" : "none"
        }

        return(
            <div className="center">
                <Modal display={modal} users={this.users} toggleModal={this.toggleModal.bind(this)} selectUser={this.selectUser.bind(this)}></Modal>
                {ticketModal}
                {this.state.createTicket || this.state.created ? (
                <div className="loading">
                    { !this.state.created ? (
                        <div className="verticalAlign">
                            <div className="sk-folding-cube">
                                <div className="sk-cube1 sk-cube"></div>
                                <div className="sk-cube2 sk-cube"></div>
                                <div className="sk-cube4 sk-cube"></div>
                                <div className="sk-cube3 sk-cube"></div>
                            </div>
                            <h4>{this.state.createTicketMessage} ...</h4>
                        </div>
                    ) : (
                        <div className="verticalAlign">
                            <div className={created}></div>
                            <h4 className="checkH4">{this.state.createTicketMessage}.</h4>
                        </div>
                    )}
                </div>
                ) : (
                <div className="ticketFormContainer">
                    <div className="header">
                        <h2>Ouverture d'un nouveau ticket</h2>
                        <div className="icon">
                            <div onClick={this.closeApp.bind(this)} className="closeApp">
                                <span className="glyphicon glyphicon-plus"></span>
                            </div>
                            <div onClick={this.reduceApp.bind(this)} className="reduceApp">
                                <span className="glyphicon glyphicon-minus"></span>
                            </div>
                        </div>
                    </div>
                    <form>
                    <label>Utilisateur</label>
                    <AsyncTypeahead
                        isLoading= {this.state.isLoading}
                        multiple= {this.state.multiple}
                        allowNew= {this.state.allowNew}
                        options= {this.state.options}
                        selected = {this.state.selected}
                        labelKey="info"
                        minLength={3}
                        searchText="Recherche en cours"
                        promptText=""
                        onSearch={this.typeAheadUser.bind(this)}
                        onChange={(selected) =>{
                            this.setState({ selected: selected });
                            const self = this;

                            var input = self._typeahead.getInput();
                            if(selected.length > 0){
                                input.style.borderColor = "#99C000";
                                
                                //Récupération des tickets ouverts pour l'organisation de l'utilisateur
                                self.ticket.ticketForOrg(selected[0].id,function(data){
                                    self.setState({ tickets: data });
                                });

                            } else {
                                input.style.borderColor = "rgba(0,0,0,.15)";
                                self.setState({ tickets: [] });
                            }
                        }}
                        ref={component => this._typeahead = component ? component.getInstance() : this._typeahead}
                        placeholder="Recherche d'un utilisateur..."
                        renderMenuItemChildren={(option, props) => (
                        <User key={option.id} user={option} />
                        )}
                    />
                    <button type="button" onClick={this.toggleModal.bind(this)} className="addUser"><span className="glyphicon glyphicon-plus"></span></button>
                    <label>Sujet</label>
                    <input className={subject} id="subject" onChange={this.handleChange.bind(this)} placeholder="Saisissez un sujet" />
                    <label>Votre problématique</label>
                    <textarea className={comments} id="comments" onChange={this.handleChange.bind(this)} placeholder="Saisisser votre problematique" />
                    <button type="button" onClick={this.openTicket.bind(this)} className={classBtn}>Ouvrir</button>
                    </form>
                </div> 
            )}
            </div>
        );
    }

    reduceApp(){
        const {remote} = electron;

        var window = remote.getCurrentWindow();
        window.minimize();
    }

    closeApp(){
        const {remote} = electron;

        var window = remote.getCurrentWindow();
        window.close();
    }

    selectUser(data){
        var options = [];
        options.push(data);

        var input = this._typeahead.getInput();
        input.style.borderColor = "#99C000";

        this.setState({
            selected : options,
            options: options,
            modal: false
        });
    }

    toggleModal(){
        this.setState({ modal: !this.state.modal });
    }

    toggleTicketModal(event,create=false){
        if(create){
            this.setState({ tickets: [] });
        } else {
            var input = this._typeahead.getInput();
            input.style.borderColor = "rgba(0,0,0,.15)";

            this.setState({
                tickets: [],
                subject:"",
                comments:""
            });

            this._typeahead._updateSelected([]);
        }
    }

    openTicket(){
        if(this.formIsValid()){

            this.setState({ 
                createTicket: true,
                createTicketMessage: "Création du ticket en cours" });

            this.ticket.createTicket(
                this.state.selected[0].id,
                this.props.store.staff_id,
                this.state.subject,
                this.state.comments,
                this.created_success.bind(this)
            );
        }
    }

    created_success(){

        const self = this;

        self.setState({ 
            createTicket: false,
            selected: [],
            subject:"",
            comments:"",
            createTicketMessage: "Ticket créé avec succès",
            created: true
         });

        window.setTimeout(function() {
            self.setState({ created:false });
        }, 2500);
    }

    formIsValid(){
        return this.state.selected.length > 0 && this.state.subject != "" && this.state.comments != "";
    }
    
    handleChange(event){
        this.setState({ [event.target.id] : event.target.value });
    }
    
    typeAheadUser(query) {
        var self = this;
        self.setState({isLoading: true});
    
        self.users.typeAhead(query,function(options){
          self.setState({
            isLoading: false,
            options,
          });
        });
    }
}