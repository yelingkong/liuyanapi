'use strict';

const { LinValidator, Rule } = require('lin-mizar');

class SourceSearchValidator extends LinValidator {
  constructor () {
    super();
    this.q = new Rule('isNotEmpty', '必须传入搜索关键字');
  }
}

class CreateOrUpdateSourceValidator extends LinValidator {
  constructor () {
    super();
    this.title = new Rule('isNotEmpty', '必须传入来源标题');
  }
}

module.exports = {
  CreateOrUpdateSourceValidator,
  SourceSearchValidator
};
