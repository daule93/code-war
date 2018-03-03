'use strict';

class Api {
  fails(errorMessages) {
    console.log(errorMessages);
    return this.ctx.response.status(400).send({
      status: 'VALIDATION_ERROR',
      validators: errorMessages,
      data: null,
    });
  }
  async customFails(error) {
    return this.ctx.response.status(400).send({
      status: 'VALIDATION_ERROR',
      validations: [
        {
          error,
        },
      ],
      data: null,
    });
  }
}
module.exports = Api;
