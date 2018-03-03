'use strict';

const User = use('App/Models/User');
const Token = use('App/Models/Token');
const Event = use('App/Models/Event');
const UserTicket = use('App/Models/UserTicket');
const Database = use('Database');
class DatabaseController {
  async resetDatabase({ response }) {
    await Database.raw('SET FOREIGN_KEY_CHECKS = 0;');
    await Token.query().truncate();
    await User.query().truncate();
    await Event.query().truncate();
    await UserTicket.query().truncate();
    await User.create({
      username: 'BE.admin',
      password: 'bapcodewar',
      is_admin: 1,
    });
    await Database.raw('SET FOREIGN_KEY_CHECKS = 1;');
    return response.status(200).send({
      status: 'SUCCESS',
    });
  }
}

module.exports = DatabaseController;
