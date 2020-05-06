'use strict';

const { LinValidator, Rule } = require('lin-mizar');

class LiuyanSearchValidator extends LinValidator {
  constructor () {
    super();
    this.pageSize = new Rule('isNotEmpty', '必须传入页码');
  }
}

class CreateOrUpdateliuyanValidator extends LinValidator {
  constructor () {
    super();
    this.name = new Rule('isNotEmpty', '请输入姓名');
  }
}

module.exports = {
  CreateOrUpdateliuyanValidator,
  LiuyanSearchValidator
};
