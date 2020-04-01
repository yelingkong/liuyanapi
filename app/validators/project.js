'use strict';

const { LinValidator, Rule } = require('lin-mizar');

class ProjectSearchValidator extends LinValidator {
  constructor () {
    super();
    this.q = new Rule('isNotEmpty', '必须传入关键字');
  }
}

class CreateOrUpdateProjectValidator extends LinValidator {
  constructor () {
    super();
    this.title = new Rule('isNotEmpty', '必须传入标题');
  }
}

module.exports = {
  CreateOrUpdateProjectValidator,
  ProjectSearchValidator
};
