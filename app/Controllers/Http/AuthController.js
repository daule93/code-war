'use strict';

const { validateAll } = use('Validator');
const User = use('App/Models/User');
const Token = use('App/Models/Token');
const Hash = use('Hash');
class AuthController {
  /**
   *
   * @param request
   * @param response
   * @return {Promise.<void|*>}
   */
  async register({ request, response }) {
    const { username, password } = request.only(['username', 'password']);
    const rules = {
      username: 'required',
      password: 'required',
    };
    const validations = await validateAll(request.all(), rules);
    if (validations.fails()) {
      const errors = validations.messages().map(validation => ({
        attribute: validation.field,
        reason: validation.validation,
      }));
      return response.status(200).send({
        status: 'VALIDATION_ERROR',
        validations: errors,
      });
    }
    const user = await User.query().where('username', username).first();
    if (user) {
      return response.status(200).send({
        status: 'USERNAME_EXISTED',
      });
    }

    await User.create({
      username,
      password,
    });
    return response.status(201).send({
      status: 'SUCCESS',
    });
  }

  /**
   *
   * @param request
   * @param response
   * @param auth
   * @return {Promise.<void|*>}
   */
  async login({ request, response, auth }) {
    const { username, password } = request.only(['username', 'password']);
    const rules = {
      username: 'required',
      password: 'required',
    };
    const validations = await validateAll(request.all(), rules);
    if (validations.fails()) {
      const errors = validations.messages().map(validation => ({
        attribute: validation.field,
        reason: validation.validation,
      }));
      return response.status(200).send({
        status: 'VALIDATION_ERROR',
        validations: errors,
      });
    }
    const user = await User.query().where('username', username).first();
    if (!user) {
      return response.status(200).send({
        status: 'USERNAME_PASSWORD_NOT_MATCHED',
      });
    }
    const compare = await Hash.verify(password, user.password);
    if (compare) {
      const token = await auth.attempt(username, password);
      await Token.create({
        user_id: user.id,
        token: token.token,
      });
      return response.status(201).send({
        status: 'SUCCESS',
        data: {
          token: `Bearer ${token.token}`,
        },
      });
    }
    return response.status(200).send({
      status: 'USERNAME_PASSWORD_NOT_MATCHED',
    });
  }
}

module.exports = AuthController;
