'use strict';

const { NotFound, Forbidden } = require('lin-mizar');
const { Liuyan } = require('../models/liuyan');
const Sequelize = require('sequelize');
var xlsx = require('node-xlsx');
var fs = require('fs');

class LiuyanDao {
  async getLiuyan (id) {
    const liuyan = await Liuyan.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    return liuyan;
  }

  async getLiuyanByKeyword (q) {
    const liuyan = await Liuyan.findOne({
      where: {
        title: {
          [Sequelize.Op.like]: `%${q}%`
        },
        delete_time: null
      }
    });
    return liuyan;
  }

  async getLiuyans (p, n, b) {
    let condition = { biaoshi: b };
    let pageSize = parseInt(p);
    let pageNum = parseInt(n) - 1;
    let { rows, count } = await Liuyan.findAndCountAll({
      where: Object.assign({}, condition),
      offset: pageNum * pageSize,
      limit: pageSize,
      order: [
        ['id', 'DESC']
      ]
    });
    console.log(rows);
    return {
      rows,
      total: count
    };
  }

  async getLiuyansallcurrent (b) {
    let condition = { biaoshi: b };
    let { rows, count } = await Liuyan.findAndCountAll({
      where: Object.assign({}, condition),
      order: [
        ['id', 'DESC']
      ]
    });
    return {
      rows,
      total: count
    };
  }

  async getLiuyansall (p, n) {
    let condition = {};
    let pageSize = parseInt(p);
    let pageNum = parseInt(n) - 1;
    let { rows, count } = await Liuyan.findAndCountAll({
      where: Object.assign({}, condition),
      offset: pageNum * pageSize,
      limit: pageSize,
      order: [
        ['id', 'DESC']
      ]
    });
    return {
      rows,
      total: count
    };
  }

  async getLiuyansallpage () {
    let condition = {};
    let { rows, count } = await Liuyan.findAndCountAll({
      where: Object.assign({}, condition),
      order: [
        ['id', 'DESC']
      ]
    });
    return {
      rows,
      total: count
    };
  }

  async createLiuyan (v) {
    const formdata = new Liuyan();
    formdata.name = v.get('body.name');
    formdata.biaoshi = v.get('body.biaoshi');
    formdata.tel = v.get('body.tel');
    formdata.status = 0;
    formdata.url = v.get('body.url');
    formdata.address = v.get('body.address');
    formdata.details = v.get('body.details');
    formdata.finish_time = v.get('body.finish_time');
    formdata.start_time = v.get('body.start_time');
    formdata.save();
  }

  async updateLiuyan (v, id) {
    const formdata = await Liuyan.findByPk(id);
    if (!formdata) {
      throw new NotFound({
        msg: '没有找到相关资源'
      });
    }
    formdata.status = v.get('body.status');
    formdata.save();
  }

  async deleteLiuyan (id) {
    const liuyan = await Liuyan.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    if (!liuyan) {
      throw new NotFound({
        msg: '没有找到留言'
      });
    }
    liuyan.destroy();
  }
}

module.exports = { LiuyanDao };
