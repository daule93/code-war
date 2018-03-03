'use strict';

const Event = use('App/Models/Event');
const User = use('App/Models/User');
const Token = use('App/Models/Token');
const UserTicket = use('App/Models/UserTicket');
const { validateAll } = use('Validator');

class EventController {
  /**
   *
   * @param request
   * @param response
   * @param auth
   * @return {Promise.<void>}
   */
  async create({ request, response }) {
    try {
      const ticketTotal = +request.input(['ticket_total']);
      const ticketPrice = +request.input(['ticket_price']);
      const startDate = request.input(['start_date']);
      const ticketStartDate = request.input(['ticket_start_date']);
      const endDate = request.input(['end_date']);
      const ticketEndDate = request.input(['ticket_end_date']);
      let validators = [];
      const authorization = request.header('Authorization');
      if (authorization === undefined) {
        return response.status(200).send({
          status: 'AUTHORIZATION_REQUIRED',
        });
      }
      const tokens = authorization.split('Bearer ');
      if (tokens.length === 1 || tokens[1] === '') {
        return response.status(200).send({
          status: 'AUTHORIZATION_REQUIRED',
        });
      }
      let userToken = await Token.query().where('token', tokens[1]).orderBy('id', 'desc').first();
      if (!userToken) {
        return response.status(200).send({
          status: 'AUTHORIZATION_REQUIRED',
        });
      }
      userToken = userToken.toJSON();
      const userId = userToken.user_id;
      let user = await User.find(userId);
      if (!user) {
        return response.status(200).send({
          status: 'AUTHORIZATION_REQUIRED',
        });
      }
      user = user.toJSON();
      if (user.is_admin === 0) {
        return response.status(200).send({
          status: 'PERMISSION_DENIED',
        });
      }
      const rules = {
        name: 'required',
        banner: 'required',
        ticket_price: 'min:1',
        // start_date: `required|before:${endDate}`,
        // end_date: `after:${startDate}`,
        // ticket_start_date: `required|before:${ticketEndDate}`,
        // ticket_end_date: `after:${ticketStartDate}`,
      };
      const timeStart = Date.parse(startDate);
      const timeTicketStart = Date.parse(ticketStartDate);
      const timeEnd = Date.parse(endDate);
      const timeTicketEnd = Date.parse(ticketEndDate);
      const validations = await validateAll(request.all(), rules);
      if (validations.fails()) {
        validators = validations.messages().map(validation => ({
          attribute: validation.field,
          reason: validation.validation,
        }));
      }

      if (!startDate || isNaN(Date.parse(startDate))) {
        validators.push({
          attribute: 'start_date',
          reason: 'required',
        });
      } else if (timeStart > timeEnd) {
        validators.push({
          attribute: 'start_date',
          reason: 'start_date_invalid',
        });
      }
      if (!ticketStartDate || isNaN(Date.parse(ticketStartDate))) {
        validators.push({
          attribute: 'ticket_start_date',
          reason: 'required',
        });
      } else if (timeTicketStart > timeTicketEnd) {
        validators.push({
          attribute: 'ticket_start_date',
          reason: 'ticket_start_date_invalid',
        });
      }
      if (isNaN(timeEnd)) {
        validators.push({
          attribute: 'end_date',
          reason: 'end_date_invalid',
        });
      }
      if (isNaN(timeTicketEnd)) {
        validators.push({
          attribute: 'ticket_end_date',
          reason: 'ticket_end_date_invalid',
        });
      }
      if (parseInt(ticketTotal, 10) !== ticketTotal || isNaN(ticketPrice) || ticketTotal <= 0) {
        validators.push({
          attribute: 'ticket_total',
          reason: 'positive_integer_required',
        });
      }
      if (isNaN(ticketPrice) || ticketPrice <= 0) {
        validators.push({
          attribute: 'ticket_price',
          reason: 'positive_number_required',
        });
      }
      if (validators.length !== 0) {
        return response.status(200).send({
          status: 'VALIDATION_ERROR',
          validations: validators,
        });
      }
      const params = request.body;
      params.user_id = user.id;
      const event = await Event.create(params);
      return response.status(201).send({
        status: 'SUCCESS',
        data: {
          event_id: event.id,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   *
   * @param request
   * @param response
   * @param auth
   * @param params
   * @return {Promise.<void>}
   */
  async update({
    request, response, auth, params,
  }) {
    const ticketTotal = +request.input(['ticket_total']);
    const ticketPrice = +request.input(['ticket_price']);
    const startDate = request.input(['start_date']);
    const ticketStartDate = request.input(['ticket_start_date']);
    const endDate = request.input(['end_date']);
    const ticketEndDate = request.input(['ticket_end_date']);
    let validators = [];
    const authorization = request.header('Authorization');
    if (authorization === undefined) {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    const tokens = authorization.split('Bearer ');
    if (tokens.length === 1 || tokens[1] === '') {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    let userToken = await Token.query().where('token', tokens[1]).orderBy('id', 'desc').first();
    if (!userToken) {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    userToken = userToken.toJSON();
    const userId = userToken.user_id;
    let user = await User.find(userId);
    if (!user) {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    user = user.toJSON();
    if (user.is_admin === 0) {
      return response.status(200).send({
        status: 'PERMISSION_DENIED',
      });
    }
    const rules = {
      name: 'required',
      banner: 'required',
      ticket_price: 'min:1',
      // start_date: `required|before:${endDate}`,
      // end_date: `after:${startDate}`,
      // ticket_start_date: `required|before:${ticketEndDate}`,
      // ticket_end_date: `after:${ticketStartDate}`,
    };
    const timeStart = Date.parse(startDate);
    const timeTicketStart = Date.parse(ticketStartDate);
    const timeEnd = Date.parse(endDate);
    const timeTicketEnd = Date.parse(ticketEndDate);
    const validations = await validateAll(request.all(), rules);
    if (validations.fails()) {
      validators = validations.messages().map(validation => ({
        attribute: validation.field,
        reason: validation.validation,
      }));
    }

    if (!startDate || isNaN(Date.parse(startDate))) {
      validators.push({
        attribute: 'start_date',
        reason: 'required',
      });
    } else if (timeStart > timeEnd) {
      validators.push({
        attribute: 'start_date',
        reason: 'start_date_invalid',
      });
    }
    if (!ticketStartDate || isNaN(Date.parse(ticketStartDate))) {
      validators.push({
        attribute: 'ticket_start_date',
        reason: 'required',
      });
    } else if (timeTicketStart > timeTicketEnd) {
      validators.push({
        attribute: 'ticket_start_date',
        reason: 'ticket_start_date_invalid',
      });
    }
    if (timeTicketStart > timeStart) {
      validators.push({
        attribute: 'ticket_start_date',
        reason: 'ticket_start_date_invalid',
      });
    }
    if (isNaN(timeEnd)) {
      validators.push({
        attribute: 'end_date',
        reason: 'end_date_invalid',
      });
    }
    if (isNaN(timeTicketEnd)) {
      validators.push({
        attribute: 'ticket_end_date',
        reason: 'ticket_end_date_invalid',
      });
    }
    if (parseInt(ticketTotal, 10) !== ticketTotal || isNaN(ticketPrice) || ticketTotal <= 0) {
      validators.push({
        attribute: 'ticket_total',
        reason: 'positive_integer_required',
      });
    }
    if (isNaN(ticketPrice) || ticketPrice <= 0) {
      validators.push({
        attribute: 'ticket_price',
        reason: 'positive_number_required',
      });
    }
    if (validators.length !== 0) {
      return response.status(200).send({
        status: 'VALIDATION_ERROR',
        validations: validators,
      });
    }
    const event = await Event.find(params.id);
    if (!event) {
      return response.status(200).send({
        status: 'EVENT_NOT_EXISTED',
      });
    }
    const paramDatas = request.body;
    paramDatas.user_id = user.id;
    await Event.query().where('id', params.id).update(paramDatas);
    return response.status(200).send({
      status: 'SUCCESS',
    });
  }

  /**
   *
   * @param request
   * @param params
   * @param response
   * @param auth
   * @return {Promise.<void|*>}
   */
  async delete({ request, params, response }) {
    const { id } = params;
    const authorization = request.header('Authorization');
    if (authorization === undefined) {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    const tokens = authorization.split('Bearer ');
    if (tokens.length === 1 || tokens[1] === '') {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    let userToken = await Token.query().where('token', tokens[1]).orderBy('id', 'desc').first();
    if (!userToken) {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    userToken = userToken.toJSON();
    const userId = userToken.user_id;
    let user = await User.find(userId);
    if (!user) {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    user = user.toJSON();
    if (user.is_admin === 0) {
      return response.status(200).send({
        status: 'PERMISSION_DENIED',
      });
    }
    const event = await Event.find(id);
    if (!event) {
      return response.status(200).send({
        status: 'EVENT_NOT_EXISTED',
      });
    }
    await event.delete();
    return response.status(200).send({
      status: 'SUCCESS',
    });
  }

  /**
   *
   * @param request
   * @param response
   * @return {Promise.<void|*>}
   */
  async get({ request, response }) {
    const params = request.only(['page', 'limit']);
    const page = params.page ? +params.page : 0;
    const limit = params.limit ? +params.limit : -1;
    let events = [];
    if (limit !== -1) {
      events = await Event.query().paginate(page+1, limit);
      events = events.toJSON().data;
    } else {
      events = await Event.query().fetch();
      events = events.toJSON();
    }
    events = events.map((event) => {
      delete event.user_id;
      delete event.created_at;
      delete event.updated_at;
      return event;
    });
    return response.status(200).send({
      status: 'SUCCESS',
      data: events,
    });
  }

  /**
   *
   * @param request
   * @param response
   * @param params
   * @return {Promise.<void|*>}
   */
  async buyTicket({ request, response, params }) {
    const authorization = request.header('Authorization');
    if (authorization === undefined) {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    const tokens = authorization.split('Bearer ');
    if (tokens.length === 1 || tokens[1] === '') {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    let userToken = await Token.query().where('token', tokens[1]).orderBy('id', 'desc').first();
    if (!userToken) {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    userToken = userToken.toJSON();
    const userId = userToken.user_id;
    let user = await User.find(userId);
    if (!user) {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    const quantity = request.input(['quantity']);
    const errors = [];
    if (!quantity || isNaN(+quantity) || parseInt(quantity, 10) !== +quantity) {
      errors.push({
        attribute: 'quantity',
        reason: 'positive_integer_required',
      });
    }
    const cardType = request.input(['card_type']);
    if (cardType !== 'visa') {
      errors.push({
        attribute: 'card_type',
        reason: 'unsupported_card_type',
      });
    }
    const cardNumber = request.input(['card_number']);
    if (!cardNumber) {
      errors.push({
        attribute: 'card_number',
        reason: 'required',
      });
    } else if (cardNumber && cardNumber.length !== 16) {
      errors.push({
        attribute: 'card_number',
        reason: 'wrong_card_number',
      });
    }
    const cardExpiration = request.input(['card_expiration']);
    if (cardExpiration === undefined || !cardExpiration) {
      errors.push({
        attribute: 'card_expiration',
        reason: 'required',
      });
    } else {
      const format = cardExpiration.split('/');
      if (+format[0] > 12 || +format[0] < 0 || +format[1] > 9999 ||
          +format[1] < 1000) {
        errors.push({
          attribute: 'card_expiration',
          reason: 'wrong_card_expiration',
        });
      }
    }
    if (errors.length !== 0) {
      return response.status(200).send({
        status: 'VALIDATION_ERROR',
        validations: errors,
      });
    }
    const paramDatas = request.only([
      'event_id',
      'quantity',
      'card_type',
      'card_number',
      'card_expiration',
      'cvc_code',
    ]);
    paramDatas.event_id = params.event_id;
    let event = await Event.find(paramDatas.event_id);
    if (!event) {
      return response.status(200).send({
        status: 'EVENT_NOT_EXISTED',
      });
    }

    const now = new Date().getTime();
    const end = new Date(event.ticket_end_date).getTime();
    const start = new Date(event.ticket_start_date).getTime();
    if (now > end || now < start) {
      return response.status(200).send({
        status: 'NOT_TIME_BUY_TICKET',
      });
    }
    let totalTicket = await UserTicket.query().where('event_id', paramDatas.event_id).fetch();
    totalTicket = totalTicket.toJSON();
    let total = 0;
    for (let i = 0; i < totalTicket.length; i += 1) {
      total += totalTicket[i].quantity;
    }
    event = event.toJSON();
    const valid = event.ticket_total - total;
    if (paramDatas.quantity > valid) {
      return response.status(200).send({
        status: 'TICKET_SOLD_OUT',
      });
    }
    user = user.toJSON();
    paramDatas.user_id = user.id;
    const userTicket = await UserTicket.create(paramDatas);
    return response.status(200).send({
      status: 'SUCCESS',
      data: {
        payment_id: userTicket.id,
      },
    });
  }

  /**
   *
   * @param params
   * @param response
   */
  async getDetail({ params, response }) {
    const { id } = params;
    let event = await Event.find(id);
    if (!event) {
      return response.status(200).send({
        status: 'EVENT_NOT_EXISTED',
      });
    }
    event = event.toJSON();
    delete event.user_id;
    delete event.created_at;
    delete event.updated_at;
    return response.status(200).send({
      status: 'SUCCESS',
      data: event,
    });
  }

  async getTicketByUser({ request, params, response }) {
    const { id } = params;
    const authorization = request.header('Authorization');
    if (authorization === undefined) {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    const tokens = authorization.split('Bearer ');
    if (tokens.length === 1 || tokens[1] === '') {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    let userToken = await Token.query().where('token', tokens[1]).orderBy('id', 'desc').first();
    if (!userToken) {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    userToken = userToken.toJSON();
    const userId = userToken.user_id;
    let user = await User.find(userId);
    if (!user) {
      return response.status(200).send({
        status: 'AUTHORIZATION_REQUIRED',
      });
    }
    user = user.toJSON();
    const event = await Event.find(id);
    if (!event) {
      return response.status(200).send({
        status: 'EVENT_NOT_EXISTED',
      });
    }

    let userTicket = await UserTicket.query().where('user_id', user.id).where('event_id', id).fetch();
    userTicket = userTicket.toJSON();
    const data = userTicket.map(ticket => ({
      id: ticket.id,
      ticket_count: ticket.quantity,
    }));
    return response.status(200).send({
      status: 'SUCCESS',
      data,
    });
  }
}

module.exports = EventController;
