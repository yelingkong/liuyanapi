'use strict';

const {
  LinRouter,
  NotFound,
  groupRequired,
  disableLoading
} = require('lin-mizar');
const { getSafeParamId } = require('../../libs/util');
const {
  FrameworkSearchValidator,
  CreateOrUpdateFrameworkValidator
} = require('../../validators/framework');

const { PositiveIdValidator } = require('../../validators/common');
const { BookNotFound } = require('../../libs/err-code');
const { FrameworkDao } = require('../../dao/framework');

// source 的红图实例
const frameworkApi = new LinRouter({
  prefix: '/v1/framework'
});

// source 的dao 数据库访问层实例
const FrameworkDto = new FrameworkDao();

frameworkApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const Framework = await FrameworkDto.getFramework(id);
  if (!Framework) {
    throw new NotFound({
      msg: '没有找到'
    });
  }
  ctx.json(Framework);
});

frameworkApi.get('/', async ctx => {
  const Framework = await FrameworkDto.getFrameworks();
  // if (!sourcies || sourcies.length < 1) {
  //   throw new NotFound({
  //     msg: '没有找到相关书籍'
  //   });
  // }
  ctx.json(Framework);
});

frameworkApi.get('/search/one', async ctx => {
  const v = await new FrameworkSearchValidator().validate(ctx);
  const source = await FrameworkDto.getFrameworkByKeyword(v.get('query.q'));
  if (!source) {
    throw new BookNotFound();
  }
  ctx.json(source);
});

frameworkApi.post('/', async ctx => {
  const v = await new CreateOrUpdateFrameworkValidator().validate(ctx);
  await FrameworkDto.createFramework(v);
  ctx.success({
    msg: '新增成功'
  });
});

frameworkApi.put('/:id', async ctx => {
  const v = await new CreateOrUpdateFrameworkValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await FrameworkDto.updateFramework(v, id);
  ctx.success({
    msg: '更新成功'
  });
});

frameworkApi.linDelete(
  'deleteFramework',
  '/:id',
  {
    auth: '删除框架',
    module: '框架',
    mount: true
  },
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await FrameworkDto.deleteFramework(id);
    ctx.success({
      msg: '删除成功'
    });
  }
);

module.exports = { frameworkApi, [disableLoading]: false };
