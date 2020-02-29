'use strict';

const {
  LinRouter,
  NotFound,
  groupRequired,
  disableLoading
} = require('lin-mizar');
const { getSafeParamId } = require('../../libs/util');
const {
  SourceSearchValidator,
  CreateOrUpdateSourceValidator
} = require('../../validators/source');

const { PositiveIdValidator } = require('../../validators/common');
const { BookNotFound } = require('../../libs/err-code');
const { SourceDao } = require('../../dao/source');

// source 的红图实例
const sourceApi = new LinRouter({
  prefix: '/v1/source'
});

// source 的dao 数据库访问层实例
const SourceDto = new SourceDao();

sourceApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const source = await SourceDto.getBook(id);
  if (!source) {
    throw new NotFound({
      msg: '没有找到相关书籍'
    });
  }
  ctx.json(source);
});

sourceApi.get('/', async ctx => {
  const sourcies = await SourceDto.getBooks();
  // if (!sourcies || sourcies.length < 1) {
  //   throw new NotFound({
  //     msg: '没有找到相关书籍'
  //   });
  // }
  ctx.json(sourcies);
});

sourceApi.get('/search/one', async ctx => {
  const v = await new SourceSearchValidator().validate(ctx);
  const source = await SourceDto.getBookByKeyword(v.get('query.q'));
  if (!source) {
    throw new BookNotFound();
  }
  ctx.json(source);
});

sourceApi.post('/', async ctx => {
  const v = await new CreateOrUpdateSourceValidator().validate(ctx);
  await SourceDto.createBook(v);
  ctx.success({
    msg: '新增来源成功'
  });
});

sourceApi.put('/:id', async ctx => {
  const v = await new CreateOrUpdateSourceValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await SourceDto.updateBook(v, id);
  ctx.success({
    msg: '更新来源成功'
  });
});

sourceApi.linDelete(
  'deleteSource',
  '/:id',
  {
    auth: '删除来源',
    module: '来源',
    mount: true
  },
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await SourceDto.deleteBook(id);
    ctx.success({
      msg: '删除来源成功'
    });
  }
);

module.exports = { sourceApi, [disableLoading]: false };
