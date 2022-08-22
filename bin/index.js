/**
 * 开发后台脚手架，快速生成标准vue后台架构
 */

let program = require("commander")
// promise库
let { promisify } = require("util")
let asyncFiglet = promisify(require("figlet"))
let chalk = require("chalk")
let inquirer = require("inquirer")
// 
let init = require("./init")
// 日志打印
const log = content => console.log(chalk.yellow(content));


// 版本号
program.version("1.0.0")
// 命令行参数
program.option("-n --name <type>", "output name")

// 打印大型logo
async function printLogo() {
  let data = await asyncFiglet("v-cli")
  log(data)
}
// 指定命令行
program
  .command("create <app-name>")  // 解析
  .description("创建一个标准的vue项目") //干什么的
  .action(async name => {    // 动作
    // 打印logo
    await printLogo()
    log("正在创建项目..."); //正在创建项目
    let answer = await inquirer.prompt([
      {
        name: "language",
        type: "list",
        message: "请选择语言版本",
        choices: ["Javascript", "Typescript"]
      }
    ])
    if (answer.language == "Javascript") {
      // 下载框架
      log("js版本，即将下载")
      init(name)
    }
    else {
      log("敬请期待")
    }
  })

// 解析
program.parse(program.argv)