'use strict';

const { InfoCrudMixin } = require('lin-mizar/lin/interface');
const { merge } = require('lodash');
const { Sequelize, Model } = require('sequelize');
const { db } = require('lin-mizar/lin/db');

class Project extends Model {
  toJSON () {
    let origin = {
      id: this.id,
      title: this.title,
      source: this.source,
      framework: this.framework,
      projecttype: this.projecttype,
      status: this.status,
      url: this.url,
      thumb: this.thumb,
      details: this.details,
      price: this.price,
      scale: this.scale,
      create_time: this.createTime,
      finish_time: this.finish_time,
      start_time: this.start_time
    };
    return origin;
  }
}

Project.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    source: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    framework: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    projecttype: {
      type: Sequelize.INTEGER(10),
      allowNull: true
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    price: {
      type: Sequelize.INTEGER(10),
      allowNull: true
    },
    scale: {
      type: Sequelize.DOUBLE,
      allowNull: true
    },
    url: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    thumb: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    details: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    finish_time: {
      type: Sequelize.DATE,
      allowNull: true
    },
    start_time: {
      type: Sequelize.DATE,
      allowNull: true
    }
  },
  merge(
    {
      tableName: 'project',
      modelName: 'project',
      sequelize: db
    },
    InfoCrudMixin.options
  )
);

module.exports = { Project };
