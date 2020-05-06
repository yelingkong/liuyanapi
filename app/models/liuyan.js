'use strict';

const { InfoCrudMixin } = require('lin-mizar/lin/interface');
const { merge } = require('lodash');
const { Sequelize, Model } = require('sequelize');
const { db } = require('lin-mizar/lin/db');

class Liuyan extends Model {
  toJSON () {
    let origin = {
      id: this.id,
      biaoshi: this.biaoshi,
      name: this.name,
      tel: this.tel,
      status: this.status,
      url: this.url,
      address: this.address,
      details: this.details
    };
    return origin;
  }
}

Liuyan.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    biaoshi: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    tel: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    url: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    address: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    details: {
      type: Sequelize.STRING(1000),
      allowNull: true
    }
  },
  merge(
    {
      tableName: 'liuyan',
      modelName: 'liuyan',
      sequelize: db
    },
    InfoCrudMixin.options
  )
);

module.exports = { Liuyan };
