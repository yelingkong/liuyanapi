'use strict';

const {
  LinRouter,
  NotFound,
  groupRequired,
  disableLoading
} = require('lin-mizar');
const { getSafeParamId } = require('../../libs/util');
const {
  ProjectSearchValidator,
  CreateOrUpdateProjectValidator
} = require('../../validators/project');

const { PositiveIdValidator } = require('../../validators/common');
const { BookNotFound } = require('../../libs/err-code');
const { ProjectDao } = require('../../dao/project');

// source 的红图实例
const ProjectApi = new LinRouter({
  prefix: '/v1/project'
});

// source 的dao 数据库访问层实例
const ProjectDto = new ProjectDao();

ProjectApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const Project = await ProjectDto.getProject(id);
  if (!Project) {
    throw new NotFound({
      msg: '没有找到'
    });
  }
  ctx.json(Project);
});

ProjectApi.get('/', async ctx => {
  const v = await new ProjectSearchValidator().validate(ctx);
  const Project = await ProjectDto.getProjects(v);
  // if (!sourcies || sourcies.length < 1) {
  //   throw new NotFound({
  //     msg: '没有找到相关书籍'
  //   });
  // }
  ctx.json(Project);
});

ProjectApi.get('/search/one', async ctx => {
  const v = await new ProjectSearchValidator().validate(ctx);
  const project = await ProjectDto.getProjectByKeyword(v.get('query.q'));
  if (!project) {
    throw new BookNotFound();
  }
  ctx.json(project);
});

ProjectApi.post('/', async ctx => {
  const v = await new CreateOrUpdateProjectValidator().validate(ctx);
  await ProjectDto.createProject(v);
  ctx.success({
    msg: '新增成功'
  });
});

ProjectApi.put('/:id', async ctx => {
  const v = await new CreateOrUpdateProjectValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await ProjectDto.updateProject(v, id);
  ctx.success({
    msg: '更新成功'
  });
});

ProjectApi.linDelete(
  'deleteProject',
  '/:id',
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await ProjectDto.deleteProject(id);
    ctx.success({
      msg: '删除成功'
    });
  }
);

module.exports = { ProjectApi, [disableLoading]: false };
