'use strict';

const { InfoCrudMixin } = require('lin-mizar/lin/interface');
const { merge } = require('lodash');
const { Sequelize, Model } = require('sequelize');
const { db } = require('lin-mizar/lin/db');

class Framework extends Model {
  toJSON () {
    let origin = {
      id: this.id,
      title: this.title,
      create_time: this.createTime
    };
    return origin;
  }
}

Framework.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(50),
      allowNull: false
    }
  },
  merge(
    {
      tableName: 'framework',
      modelName: 'framework',
      sequelize: db
    },
    InfoCrudMixin.options
  )
);

module.exports = { Framework };
