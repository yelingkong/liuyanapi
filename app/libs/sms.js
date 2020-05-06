const SMSClient = require('@alicloud/sms-sdk');
const { config } = require('lin-mizar/lin/config');
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = config.getItem('smsAccessKey');
const secretAccessKey = config.getItem('smsAccessKeySecret');
//  初始化sms_client
let smsClient = new SMSClient({ accessKeyId, secretAccessKey });
const { toSafeInteger, get, isInteger } = require('lodash');
const { ParametersException } = require('lin-mizar');

function getSmsCode (ctx) {
  const id = toSafeInteger(get(ctx.params, 'code'));
  if (id !== ctx.session.verifCode) {
    throw new ParametersException({
      msg: '验证码错误'
    });
  }
  return true;
}

// 生成验证码
function createCode (length) {
  var code = '';
  for (var i = 1; i <= length; i++) {
    code += (parseInt(Math.random() * 10));
  }
  return code;
}

//  发送短信
function sendSms (tel, code) {
  smsClient.sendSMS({
    PhoneNumbers: tel, // 必填:待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码,批量调用相对于单条调用及时性稍有延迟,验证码类型的短信推荐使用单条调用的方式；发送国际/港澳台消息时，接收号码格式为：国际区号+号码，如“85200000000”
    SignName: config.getItem('SignName'), // 必填:短信签名-可在短信控制台中找到
    TemplateCode: config.getItem('TemplateCode'), // 必填:短信模板-可在短信控制台中找到，发送国际/港澳台消息时，请使用国际/港澳台短信模版
    TemplateParam: '{"code":' + code + '}' // 可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时。
  }).then(function (res) {
    let { Code } = res;
    if (Code === 'OK') {
      // 处理返回参数
      console.log(res);
    }
  }, function (err) {
    console.log(err);
  });
}

module.exports = { createCode, sendSms, getSmsCode };
