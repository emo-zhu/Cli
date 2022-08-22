/**
 * 项目克隆
 */
let { promisify } = require('util')
const ora = require("ora")
const download = promisify(require("download-git-repo"))
let chalk = require("chalk")
const shell = require("shelljs")

// 日志函数
const log = content => console.log(chalk.yellow(content));

module.exports = async (appName) => {
  log(`创建项目 ${appName}`)
  // 删除
  shell.rm("-rf", appName)
  const spinner = ora("下载中...").start()
  try {
    await download('direct:https://gitee.com/ting-feng-zhu/vue3_manager_server.git', appName, { clone: true })
    // spinner.successd("下载完成")
    log(`
下载完成，请启动：
cd ${appName}
安装依赖：
yarn or npm i
运行项目：
npm run dev
或者
yarn dev
    `)
    spinner.stop()

  } catch (error) {
    log(`下载失败`, error)
    spinner.stop()
  }

  // await download('direct:https://gitee.com/ting-feng-zhu/vue3_manager_server.git', appName, { clone: true }).then((result) => {
  //   // spinner.successd("下载完成")
  //   log(`下载完成，请启动：
  //   cd ${appName}
  //   npm run dev
  //   或者
  //   yarn dev
  //   `)
  //   spinner.stop()
  // }).catch((err) => {
  //   log(`下载失败`, err)
  //   spinner.stop()
  // });


}