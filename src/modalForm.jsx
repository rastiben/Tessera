import React from 'react';

export default class TicketForm extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            lastname:"",
            firstname:"",
            email:"",
            phone:""
        }
    }

    render(){

        const classUserBtn = this.formIsValid() ? "enabled" : "disabled";

        const lastname = this.state.lastname != "" ? "valid" : "invalid";
        const firstname = this.state.firstname != "" ? "valid" : "invalid";
        const email = this.state.email != "" ? "valid" : "invalid";
        const phone = this.state.phone != "" ? "valid" : "invalid";

        return(
            <div className={"modal " + this.props.display}>
                <form>
                    <div className="container">
                        <input id="lastname" value={this.state.lastname} className={lastname} onChange={this.handleChange.bind(this)} placeholder="Nom" />
                        <input id="firstname" value={this.state.firstname} className={firstname} onChange={this.handleChange.bind(this)} placeholder="Prénom" />
                        <input id="email" value={this.state.email} className={email} onChange={this.handleChange.bind(this)} placeholder="Adresse email" />
                        <input id="phone" value={this.state.phone} className={phone} onChange={this.handleChange.bind(this)} placeholder="Numéro de téléphone" />
                        <div className="buttons">
                            <div className="button">
                                <button type="button" onClick={this.addUser.bind(this)} className={classUserBtn}>Valider</button>
                            </div>
                            <div className="button">
                                <button type="button" onClick={this.props.toggleModal} className="cancel">Annuler</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            );

    }

    addUser(){

        const self = this;

        if(self.formIsValid()){

            self.props.users.create(self.state.lastname,
                self.state.firstname,
                self.state.email,
                self.state.phone,
                function(data){
                    
                    self.props.selectUser(data);

                    self.setState({
                        firstname: "",
                        lastname: "",
                        email: "",
                        phone: ""
                    });
                }
            );

            //this.setState({ modal: false });
        }
    }

    handleChange(event){
        this.setState({ [event.target.id] : event.target.value });
    }

    formIsValid(){
        return this.state.lastname != "" && this.state.firstname != "" && this.state.email != "" && this.state.phone != "";
    }

}