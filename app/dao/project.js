'use strict';

const { NotFound, Forbidden } = require('lin-mizar');
const { Project } = require('../models/project');
const Sequelize = require('sequelize');
class ProjectDao {
  async getProject (id) {
    const project = await Project.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    return project;
  }

  async getProjectByKeyword (q) {
    const project = await Project.findOne({
      where: {
        title: {
          [Sequelize.Op.like]: `%${q}%`
        },
        delete_time: null
      }
    });
    return project;
  }

  async getProjects (v) {
    const pageNum = v.get('query.pageNum') ? v.get('query.pageNum') : 1;
    const pageSize = v.get('query.pageSize') ? v.get('query.pageSize') : 10;
    let { rows, count } = await Project.findAll({
      where: Object.assign({}),
      offset: pageNum * pageSize,
      limit: pageSize,
      order: [['DESC']]
    });
    return {
      rows,
      total: count
    };
  }

  async createProject (v) {
    const data = await Project.findOne({
      where: {
        title: v.get('body.title'),
        delete_time: null
      }
    });
    if (data) {
      throw new Forbidden({
        msg: '项目已存在'
      });
    }
    const formdata = new Project();
    formdata.title = v.get('body.title');
    formdata.source = v.get('body.source');
    formdata.framework = v.get('body.framework');
    formdata.projecttype = v.get('body.projecttype');
    formdata.status = v.get('body.status');
    formdata.url = v.get('body.url');
    formdata.thumb = v.get('body.thumb');
    formdata.details = v.get('body.details');
    formdata.price = v.get('body.price');
    formdata.scale = v.get('body.scale');
    formdata.finish_time = v.get('body.finish_time');
    formdata.start_time = v.get('body.start_time');
    formdata.save();
  }

  async updateProject (v, id) {
    const formdata = await Project.findByPk(id);
    if (!formdata) {
      throw new NotFound({
        msg: '没有找到相关资源'
      });
    }
    formdata.title = v.get('body.title');
    formdata.source = v.get('body.source');
    formdata.framework = v.get('body.framework');
    formdata.projecttype = v.get('body.projecttype');
    formdata.status = v.get('body.status');
    formdata.url = v.get('body.url');
    formdata.thumb = v.get('body.thumb');
    formdata.details = v.get('body.details');
    formdata.price = v.get('body.price');
    formdata.scale = v.get('body.scale');
    formdata.finish_time = v.get('body.finish_time');
    formdata.start_time = v.get('body.start_time');
    formdata.save();
  }

  async deleteProject (id) {
    const project = await Project.findOne({
      where: {
        id,
        delete_time: null
      }
    });
    if (!project) {
      throw new NotFound({
        msg: '没有找到相关框架'
      });
    }
    project.destroy();
  }
}

module.exports = { ProjectDao };
