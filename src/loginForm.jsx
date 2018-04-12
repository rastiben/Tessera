import React from 'react';
import keytar from 'keytar';
import { observer } from "mobx-react"

@observer
export default class LoginForm extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            loading:"Chargement des identifiants",
        }
    }

    componentDidMount(){
        const self = this;

        keytar.findCredentials("Tessera").then(function(data){
            if(data.length > 0){
                window.setTimeout(function() {
                    data = data[0];
                    self.props.store.login = data.account;
                    self.props.store.password = data.password;
                    self.connexion();
                }, 2000);
            } else {
                self.setState({ loading : "" });
            }
        });
    }

    render(){

        const connexionFailed = this.props.store.err != "" ? "failed" : "";

        return(
            <div className="center">
                {this.state.loading != "" ? (
                    <div className="loading">
                        <div className="verticalAlign">
                            <div className="sk-folding-cube">
                                <div className="sk-cube1 sk-cube"></div>
                                <div className="sk-cube2 sk-cube"></div>
                                <div className="sk-cube4 sk-cube"></div>
                                <div className="sk-cube3 sk-cube"></div>
                            </div>
                            <h4>{this.state.loading} ...</h4>
                        </div>
                    </div>
                ) : (
                    <form className="login">
                        <div className="header">
                            <h2>Connexion</h2>
                        </div>
                        <label>Identifiant</label>
                        <input id="login" className={connexionFailed} value={this.props.store.login} onChange={this.handleChange.bind(this)} ref={(input) => this.login = input} placeholder="Identifiant" />
                        <label>Mot de passe</label>
                        <input id="password" className={connexionFailed} value={this.props.store.password} onChange={this.handleChange.bind(this)} ref={(input) => this.password = input} type="password" placeholder="Mot de passe" />
                        <span className="error">{this.props.store.err}</span>
                        <button type="button" onClick={this.connexion.bind(this)}>Se connecter</button>
                    </form>
                )}
            </div>
        )
    }

    handleChange(event){

        this.props.store[event.target.id] = event.target.value;

        if(this.props.store.err != "")
            this.props.store.err = "";
    }

    connexion_success(){
        keytar.setPassword('Tessera', 
        this.props.store.login, 
        this.props.store.password);
    }

    connexion_failed(){
        this.setState({ 
            loading:""
        });
    }

    connexion(){

        const self = this;

        self.setState({
            loading:"Connexion en cours",
        });

        window.setTimeout(function() {
            self.props.store.connexion(
                self.connexion_success.bind(self),
                self.connexion_failed.bind(self));
        }, 2000);
    }
}