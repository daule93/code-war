'use strict';

const Api = use('App/Validators/Api');
class BuyTicket extends Api {
  get rules () {
    return {
      event_id: 'required',
    };
  }
}

module.exports = BuyTicket;
