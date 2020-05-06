'use strict';

const { LinValidator, Rule } = require('lin-mizar');

class SmsValidator extends LinValidator {
  constructor () {
    super();
    this.code = new Rule('isNotEmpty', '请输入验证码');
  }
}
module.exports = {
  SmsValidator
};
