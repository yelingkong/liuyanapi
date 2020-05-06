'use strict';

const session = require('koa-session');

const {
  LinRouter,
  routeMetaInfo,
  adminRequired,
  NotFound,
  Failed
} = require('lin-mizar');
const { getSafeParamId } = require('../../libs/util');
const {
  SmsValidator
} = require('../../validators/sms');
const { PositiveIdValidator } = require('../../validators/common');
const { BookNotFound } = require('../../libs/err-code');
const { BookDao } = require('../../dao/book');
const { createCode } = require('../../libs/sms');
// book 的红图实例
const smsApi = new LinRouter({
  prefix: '/v1/sms'
});

// book 的dao 数据库访问层实例
const bookDto = new BookDao();

smsApi.post('/verify', async ctx => {
  const code = ctx.request.body.code;
  console.log(code);
  console.log(ctx.session.verifCode);
  console.log('=================');
  if (code !== ctx.session.verifCode) {
    throw new NotFound({
      msg: '验证码错误'
    });
  }
});
smsApi.get('/captcha', (ctx, next) => {
  let txt = createCode(4);
  ctx.session.verifCode = txt;
  ctx.success({
    msg: '验证码发送成功' + txt
  });
});
module.exports = { smsApi };
