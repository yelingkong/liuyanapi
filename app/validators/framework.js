'use strict';

const { LinValidator, Rule } = require('lin-mizar');

class FrameworkSearchValidator extends LinValidator {
  constructor () {
    super();
    this.q = new Rule('isNotEmpty', '必须传入关键字');
  }
}

class CreateOrUpdateFrameworkValidator extends LinValidator {
  constructor () {
    super();
    this.title = new Rule('isNotEmpty', '必须传入标题');
  }
}

module.exports = {
  CreateOrUpdateFrameworkValidator,
  FrameworkSearchValidator
};
