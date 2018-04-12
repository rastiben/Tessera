import request from 'request';

export default class Users {

    store = null;

    constructor(store){
        this.store = store;
    }

    typeAhead(users,callback){

        const self = this;

        if(users.length >= 3){

            request.post({
                url: self.store.addr + "api/users/"+users,//your url
                headers:{
                    'X-API-Key' : self.store.apiKey
                }
            },function (response, err, body){
                if(err.statusCode == 401){
                    self.store.connexion(self.typeAhead(users,callback));
                } else {
                    callback(JSON.parse(body));
                }
            }.bind(this));

        }
    }

    create(lastname,firstname,email,phone,callback){

        const self = this;

        request.post({
            url: self.store.addr + "api/users",
            headers:{
                'X-API-Key' : self.store.apiKey
            },
            form:{
                name: lastname,
                firsname: firstname,
                email: email,
                phone: phone
            }
        },function (response, err, body){
            if(err.statusCode == 401){
                self.store.connexion(self.create(lastname,firstname,email,phone,callback));
            } else {
                body = JSON.parse(body);
                callback(body);
            }
        }.bind(this));

    }
}