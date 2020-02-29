'use strict';

const { NotFound, Forbidden } = require('lin-mizar');
const { Source } = require('../models/source');
const Sequelize = require('sequelize');

class SourceDao {
  async getSource (id) {
    const source = await Source.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    return source;
  }

  async getSourceByKeyword (q) {
    const source = await Source.findOne({
      where: {
        title: {
          [Sequelize.Op.like]: `%${q}%`
        },
        delete_time: null
      }
    });
    return source;
  }

  async getSourcies () {
    const sourcies = await Source.findAll({
      where: {
        delete_time: null
      }
    });
    return sourcies;
  }
  async createSource (v) {
    const source = await Source.findOne({
      where: {
        title: v.get('body.title'),
        delete_time: null
      }
    });
    if (source) {
      throw new Forbidden({
        msg: '图书已存在'
      });
    }
    const bk = new Source();
    bk.title = v.get('body.title');
    bk.author = v.get('body.author');
    bk.summary = v.get('body.summary');
    bk.image = v.get('body.image');
    bk.save();
  }

  async updateSource (v, id) {
    const source = await Source.findByPk(id);
    if (!source) {
      throw new NotFound({
        msg: '没有找到相关书籍'
      });
    }
    source.title = v.get('body.title');
    source.author = v.get('body.author');
    source.summary = v.get('body.summary');
    source.image = v.get('body.image');
    source.save();
  }

  async deleteSource (id) {
    const source = await Source.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    if (!source) {
      throw new NotFound({
        msg: '没有找到相关书籍'
      });
    }
    source.destroy();
  }
}

module.exports = { SourceDao };
