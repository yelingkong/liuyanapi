'use strict';

const {
  LinRouter,
  NotFound,
  groupRequired,
  disableLoading
} = require('lin-mizar');
const { getSafeParamId } = require('../../libs/util');
const {
  BookSearchValidator,
  CreateOrUpdateBookValidator
} = require('../../validators/book');

const { PositiveIdValidator } = require('../../validators/common');

const { BookNotFound } = require('../../libs/err-code');
const { BookDao } = require('../../dao/book');

// book 的红图实例
const sourceApi = new LinRouter({
  prefix: '/v1/source'
});

// book 的dao 数据库访问层实例
const bookDto = new BookDao();

sourceApi.get('/:id', async ctx => {
  const v = await new PositiveIdValidator().validate(ctx);
  const id = v.get('path.id');
  const book = await bookDto.getBook(id);
  if (!book) {
    throw new NotFound({
      msg: '没有找到相关书籍'
    });
  }
  ctx.json(book);
});

sourceApi.get('/', async ctx => {
  const books = await bookDto.getBooks();
  // if (!books || books.length < 1) {
  //   throw new NotFound({
  //     msg: '没有找到相关书籍'
  //   });
  // }
  ctx.json(books);
});

sourceApi.get('/search/one', async ctx => {
  const v = await new BookSearchValidator().validate(ctx);
  const book = await bookDto.getBookByKeyword(v.get('query.q'));
  if (!book) {
    throw new BookNotFound();
  }
  ctx.json(book);
});

sourceApi.post('/', async ctx => {
  const v = await new CreateOrUpdateBookValidator().validate(ctx);
  await bookDto.createBook(v);
  ctx.success({
    msg: '新增来源成功'
  });
});

sourceApi.put('/:id', async ctx => {
  const v = await new CreateOrUpdateBookValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await bookDto.updateBook(v, id);
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
    await bookDto.deleteBook(id);
    ctx.success({
      msg: '删除来源成功'
    });
  }
);

module.exports = { sourceApi, [disableLoading]: false };
