'use strict';

const Schema = use('Schema');

class EventSchema extends Schema {
  up () {
    this.create('events', (table) => {
      table.increments();
      table.string('name');
      table.string('banner');
      table.text('description');
      table.integer('ticket_total').default(0);
      table.integer('ticket_price').default(0);
      table.date('start_date');
      table.date('end_date');
      table.date('ticket_start_date');
      table.date('ticket_end_date');
      table.integer('user_id');
      table.timestamps();
    });
  }

  down () {
    this.drop('events');
  }
}

module.exports = EventSchema;
