'use strict';

const Koa = require('koa');
const KoaBodyParser = require('koa-bodyparser');
const session = require('koa-session');
const cors = require('@koa/cors');
const { config } = require('lin-mizar/lin/config');
const mount = require('koa-mount');
const serve = require('koa-static');

function applyCors (app) {
  // 跨域
  app.use(cors());
}

function applyBodyParse (app) {
  // 参数解析
  app.use(KoaBodyParser());
}

function applyStatic (app, prefix = '/assets') {
  const assetsDir = config.getItem('file.storeDir', 'app/static');
  app.use(mount(prefix, serve(assetsDir)));
}

function indexPage (app) {
  app.context.manager.loader.mainRouter.get('/', async ctx => {
    ctx.type = 'html';
    ctx.body = `<style type="text/css">*{ padding: 0; margin: 0; } div{ padding: 4px 48px;} a{color:#2E5CD5;cursor:
      pointer;text-decoration: none} a:hover{text-decoration:underline; } body{ background: #fff; font-family:
      "Century Gothic","Microsoft yahei"; color: #333;font-size:18px;} h1{ font-size: 100px; font-weight: normal;
      margin-bottom: 12px; } p{ line-height: 1.6em; font-size: 42px }</style><div style="padding: 24px 48px;"><p>
      Lin <br/><span style="font-size:30px">心上无垢，林间有风。</span></p></div> `;
  });
}

async function createApp () {
  const app = new Koa();
  const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) cookie 的Name */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000, /** cookie 的过期时间 */
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false
  }

  app.keys = ['login secret'] // 加密密钥
  app.use(session(CONFIG, app));
  applyBodyParse(app);
  applyCors(app);
  applyStatic(app);
  config.initApp(app);
  const { log, error, Lin, multipart } = require('lin-mizar');
  app.use(log);
  app.on('error', error);
  const lin = new Lin();
  await lin.initApp(app, true, true, null, null, null);
  indexPage(app);
  multipart(app);
  return app;
}

module.exports = { createApp };
