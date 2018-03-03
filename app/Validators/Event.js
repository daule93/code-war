'use strict';

const Api = use('App/Validators/Api');
const { validate } = use('Validator')
class Event extends Api {
  get rules () {
    const req = this.ctx.request;
    const startDate = req.input(['start_date']);
    const ticketStartDate = req.input(['ticket_start_date']);
    const endDate = req.input(['end_date']);
    const ticketEndDate = req.input(['ticket_end_date']);
    return {
      name: 'required',
      banner: 'required',
      ticket_price: 'min:1',
      start_date: `required|before:${endDate}`,
      end_date: `required|after:${startDate}`,
      ticket_start_date: `required|before:${ticketEndDate}`,
      ticket_end_date: `required|after:${ticketStartDate}`,
    };
  }
}

module.exports = Event;
