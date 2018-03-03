'use strict';

const Api = use('App/Validators/Api');

class Register extends Api {

  get rules () {
    return {
      username: 'required',
      password: 'required',
    };
  }

  get messages () {
    return {
      'username.required': 'username_is_required',
      'password.required': 'password_is_required',
    };
  }
}

module.exports = Register;
