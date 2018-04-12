import { observable,action } from "mobx";
import request from 'request';

class ConnexionStore {

    @observable login = "";
    @observable password = "";
    @observable err = "";
    @observable apiKey = "";
    @observable staff_id = "";
    //http://localhost:8080/https-osticket/
    //https://tessera.viennedoc.fr/
    @observable addr = "https://tessera.viennedoc.fr/"

    @action connexion = (callback_success,callback_failed) => {

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        const self = this;

        request.post({
            url: self.addr + "api/login/staff",
            form:{
                login:self.login,
                password:self.password
            }
        },function (response, err, body){
            if(err.statusCode == 401){
                self.err = err.body;
                if(callback_failed) callback_failed();
            } else {
                body = JSON.parse(body);
                self.apiKey = body.apiKey;
                self.staff_id = body.staff_id;
                if(callback_success) callback_success();
            }
        }.bind(this));
    }    

}

var store = window.store = new ConnexionStore;

export default store;