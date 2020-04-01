'use strict';

const { NotFound, Forbidden } = require('lin-mizar');
const { Framework } = require('../models/framework');
const Sequelize = require('sequelize');

class FrameworkDao {
  async getFramework (id) {
    const framework = await Framework.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    return framework;
  }

  async getFrameworkByKeyword (q) {
    const framework = await Framework.findOne({
      where: {
        title: {
          [Sequelize.Op.like]: `%${q}%`
        },
        delete_time: null
      }
    });
    return framework;
  }

  async getFrameworks () {
    const framework = await Framework.findAll({
      where: {
        delete_time: null
      }
    });
    return framework;
  }
  async createFramework (v) {
    const framework = await Framework.findOne({
      where: {
        title: v.get('body.title'),
        delete_time: null
      }
    });
    if (framework) {
      throw new Forbidden({
        msg: '框架已存在'
      });
    }
    const bk = new Framework();
    bk.title = v.get('body.title');
    bk.save();
  }

  async updateFramework (v, id) {
    const framework = await Framework.findByPk(id);
    if (!framework) {
      throw new NotFound({
        msg: '没有找到相关框架'
      });
    }
    framework.title = v.get('body.title');
    framework.save();
  }

  async deleteFramework (id) {
    const framework = await Framework.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    if (!framework) {
      throw new NotFound({
        msg: '没有找到相关框架'
      });
    }
    framework.destroy();
  }
}

module.exports = { FrameworkDao };
