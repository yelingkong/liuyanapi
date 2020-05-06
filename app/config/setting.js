'use strict';

module.exports = {
  port: 5000,
  siteDomain: 'http://localhost:5000',
  countDefault: 10,
  pageDefault: 0,
  apiDir: 'app/api',
  // 短信key
  smsAccessKey: 'LTAI4Fj1x7md4PaGvReF84JX',
  smsAccessKeySecret: 'ZzPGGCD5actDSojU5Te6Lozz',
  TemplateCode: 'SMS_176538034',
  SignName: '众寻互联',
  accessExp: 60 * 60, // 1h 单位秒
  // debug 模式
  debug: true,
  // refreshExp 设置refresh_token的过期时间，默认一个月
  refreshExp: 60 * 60 * 24 * 30,
  // 暂不启用插件
  pluginPath: {
    // plugin name
    // poem: {
    //   // determine a plugin work or not
    //   enable: true,
    //   // path of the plugin that relatived the workdir
    //   path: "app/plugins/poem",
    //   // other config
    //   limit: 2
    // },
    // notify: {
    //   enable: true,
    //   path: "app/plugins/notify",
    //   retry: 2000
    // }
  }
};
