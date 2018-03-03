'use strict';

const Schema = use('Schema');

class UserTicketSchema extends Schema {
  up () {
    this.create('user_tickets', (table) => {
      table.increments();
      table.integer('user_id');
      table.integer('event_id');
      table.integer('quantity');
      table.string('card_type');
      table.string('card_number');
      table.string('card_expiration');
      table.string('cvc_code');
      table.timestamps();
    });
  }

  down () {
    this.drop('user_tickets');
  }
}

module.exports = UserTicketSchema;
