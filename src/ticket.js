import request from 'request';

export default class Ticket {

    store = null;

    constructor(store){
        this.store = store;
    }

    createTicket(uid,staff_id,subject,message,callback){
        const self = this;

        const body = {
            "source":"API",
            "uid": uid,
            "staff_id": staff_id,
            "subject": subject,
            "ip": "localhost",
            "message": message,
            "forwho": "API"
        };

        request.post({
            url: self.store.addr + "api/tickets.json",//your url
            headers:{
                'X-API-Key' : self.store.apiKey
            },
            body: JSON.stringify(body),
        },function (response, err, body){
            if(err.statusCode == 401){
                self.store.connexion(self.createTicket(uid,staff_id,subject,message,callback));
            } else {
                callback();
            }
        }.bind(this));

    }

    ticketForOrg(user,callback){
        const self = this;

        request.post({
            url: self.store.addr + "api/tickets/"+user,//your url
            headers:{
                'X-API-Key' : self.store.apiKey
            }
        },function (response, err, body){
            if(err.statusCode == 401){
                self.store.connexion(self.ticketForOrg(user,callback));
            } else {
                body = JSON.parse(body);
                callback(body);
            }
        }.bind(this));

    }

}