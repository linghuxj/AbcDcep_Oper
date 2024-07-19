// 配置编译环境和线上环境之间的切换

const env = process.env;
const baseUrl = "";
// 图表库为avue2套地址
const iconfontVersion = [
  "567566_qo5lxgtishg",
  "667895_v7uduh4zui",
  "588710_kaf2cr6zsqe",
  "588710_c1shxfltkzj",
  "588710_s399ybhoc9i",
  "1939384_py29teid2yh",
  "1939384_wo5ipuk54rg",
  "588710_kz0c6ntee6l",
  "588710_se2vy5dqrma",
  "588710_upuf3r0bf1",
  "588710_7ecbcxgtml9"
];
const iconfontUrl = "//at.alicdn.com/t/font_$key.css";
const codeUrl = `${window.location.origin}/code`;
const actUrl = `${window.location.origin}/act/modeler.html?modelId=`;
if (env.NODE_ENV === "development") {
} else if (env.NODE_ENV === "production") {
} else if (env.NODE_ENV === "test") {
}
export { baseUrl, actUrl, iconfontUrl, iconfontVersion, codeUrl, env };
