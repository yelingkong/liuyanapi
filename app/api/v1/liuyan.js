'use strict';
var nodeExcel = require('excel-export');
var moment = require('moment');
const {
  LinRouter,
  NotFound,
  groupRequired,
  disableLoading
} = require('lin-mizar');
const { getSafeParamId } = require('../../libs/util');
const {
  LiuyanSearchValidator,
  CreateOrUpdateliuyanValidator
} = require('../../validators/liuyan');

const { PositiveIdValidator, PositiveBiaoshiValidator } = require('../../validators/common');
const { BookNotFound } = require('../../libs/err-code');
const { LiuyanDao } = require('../../dao/liuyan');

// source 的红图实例
const LiuyanApi = new LinRouter({
  prefix: '/v1/liuyan'
});

// source 的dao 数据库访问层实例
const LiuyanDto = new LiuyanDao();

// LiuyanApi.get('/:id', async ctx => {
//   const v = await new PositiveIdValidator().validate(ctx);
//   const id = v.get('path.id');
//   const liuyan = await LiuyanDto.getLiuyan(id);
//   if (!liuyan) {
//     throw new NotFound({
//       msg: '没有找到'
//     });
//   }
//   ctx.json(liuyan);
// });

LiuyanApi.get('/auth', async ctx => {
  const v = await new LiuyanSearchValidator().validate(ctx);
  const liuyan = await LiuyanDto.getLiuyans(v.get('query.pageSize'), v.get('query.pageNum'), v.get('query.biaoshi'));
  ctx.json(liuyan);
});
LiuyanApi.get('/all', async ctx => {
  const v = await new LiuyanSearchValidator().validate(ctx);
  const liuyan = await LiuyanDto.getLiuyansall(v.get('query.pageSize'), v.get('query.pageNum'));
  ctx.json(liuyan);
});

LiuyanApi.linGet(
  'getLiuyansallpage',
  '/downall',
  {
    auth: '下载全部留言',
    module: '留言',
    mount: true
  },
  groupRequired,
  async ctx => {
    const liuyan = await LiuyanDto.getLiuyansallpage();
    var data = liuyan.rows;
    var conf = {};
    var cols = ['id', '姓名', '电话', '城市', '详细地址', '标识'];
    conf.cols = [];

    for (let i = 0; i < cols.length; i++) {
      var tits = {};
      tits.caption = cols[i];
      tits.type = 'string';
      conf.cols.push(tits);
    }
    if (data) {
      var tows = ['id', 'name', 'tel', 'address', 'details', 'biaoshi'];
      var datas = [];
      let towsLen = tows.length;
      let dataLen = data.length;
      for (let i = 0; i < dataLen; i++) {
        let row = [];
        for (let j = 0; j < towsLen; j++) {
          if (data[i][tows[j]]) {
            row.push(data[i][tows[j]].toString());
          } else {
            row.push(' ');
          }
        }
        datas.push(row);
      }
      conf.rows = datas;
      var result = nodeExcel.execute(conf);
      ctx.set('Content-Type', 'application/vnd.openxmlformats');
      ctx.set('Content-Disposition', 'attachment; filename=city' + moment(new Date().getTime()).format('YYYYMMDDhhmmss') + '.xlsx');
      // ctx.end(result, 'binary');
      let datas2 = Buffer.from(result, 'binary');
      ctx.body = datas2;
    }
  }
);

LiuyanApi.get(
  '/downallcurrent/:id',
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    const liuyan = await LiuyanDto.getLiuyansallcurrent(id);
    var data = liuyan.rows;
    var conf = {};
    var cols = ['id', '姓名', '电话', '城市', '详细地址', '标识'];
    conf.cols = [];

    for (let i = 0; i < cols.length; i++) {
      var tits = {};
      tits.caption = cols[i];
      tits.type = 'string';
      conf.cols.push(tits);
    }
    if (data) {
      var tows = ['id', 'name', 'tel', 'address', 'details', 'biaoshi'];
      var datas = [];
      let towsLen = tows.length;
      let dataLen = data.length;
      for (let i = 0; i < dataLen; i++) {
        let row = [];
        for (let j = 0; j < towsLen; j++) {
          if (data[i][tows[j]]) {
            row.push(data[i][tows[j]].toString());
          } else {
            row.push(' ');
          }
        }
        datas.push(row);
      }
      conf.rows = datas;
      var result = nodeExcel.execute(conf);
      ctx.set('Content-Type', 'application/vnd.openxmlformats');
      ctx.set('Content-Disposition', 'attachment; filename=city' + moment(new Date().getTime()).format('YYYYMMDDhhmmss') + '.xlsx');
      // ctx.end(result, 'binary');
      let datas2 = Buffer.from(result, 'binary');
      ctx.body = datas2;
    }
  }
);

LiuyanApi.get('/search/one', async ctx => {
  const v = await new LiuyanSearchValidator().validate(ctx);
  const liuyan = await LiuyanDto.getLiuyanByKeyword(v.get('query.q'));
  if (!liuyan) {
    throw new BookNotFound();
  }
  ctx.json(liuyan);
});

LiuyanApi.post('/', async ctx => {
  const v = await new CreateOrUpdateliuyanValidator().validate(ctx);
  await LiuyanDto.createLiuyan(v);
  ctx.success({
    msg: '提交成功'
  });
});

LiuyanApi.put('/:id', async ctx => {
  const v = await new CreateOrUpdateliuyanValidator().validate(ctx);
  const id = getSafeParamId(ctx);
  await LiuyanDto.updateLiuyan(v, id);
  ctx.success({
    msg: '更新成功'
  });
});

LiuyanApi.linDelete(
  'deleteliuyan',
  '/:id',
  {
    auth: '删除留言',
    module: '留言',
    mount: true
  },
  groupRequired,
  async ctx => {
    const v = await new PositiveIdValidator().validate(ctx);
    const id = v.get('path.id');
    await LiuyanDto.deleteLiuyan(id);
    ctx.success({
      msg: '删除成功'
    });
  }
);

module.exports = { LiuyanApi, [disableLoading]: false };
