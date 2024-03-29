// 一些常用的校验规则
const mobileRules = [
  { required: true, message: '请输入手机号' },
  {
    pattern: /^1[3-9]\d{9}$/,
    message: '手机号格式不正确'
  }
]
const passwordRules = [
  { required: true, message: '请输入密码' },
  {
    pattern: /^\w{8,24}$/,
    message: '密码需8-24个字符'
  }
]
// 短信验证码校验
const codeRules = [
  { required: true, message: '请输入验证码' },
  {
    pattern: /^\d{6}$/,
    message: '验证码格式不正确'
  }
]
// 姓名
const nameRules = [
  { required: true, message: '请输入姓名' },
  {
    pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
    message: '请输入2-8位中文汉字'
  }
]
// 身份证号
const idCardRules = [
  { required: true, message: '请输入身份证号' },
  {
    pattern:
      /^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/,
    message: '身份证号不正确'
  }
]
export { mobileRules, passwordRules, codeRules, nameRules, idCardRules }
