// 命令行参数输入交互


// 通过commander解构一个program
const { program } = require('commander')

// 获取实例
let inquirer = require("inquirer")

// 设定版本号
program.version('0.0.1')

// 指定一个参数
program.option("-n", "输出名称")
program.option("-t --type <type>", "项目类型")

// 使用inquirer
inquirer.prompt([
  {
    name: "userName",
    type: "input",
    message: "你的名字叫什么"
  },
  {
    name: "age",
    type: "checkbox",
    message: "你多大了",
    choices: ["20-25", "25-30", "30-40", "40以上"],
  },
  {
    name: "salary",
    type: "list",
    message: "你的薪资是多少？",
    choices: ["10k-20k", "20k-30k", "30k-40k"]
  }

]).then(answer => {
  console.log("回答内容", answer);
  // 回答内容 { userName: 'emo', age: [ '20-25' ], salary: '10k-20k' }
})
// 你的名字叫什么 emo
// ? 你多大了 20-25
// ? 你的薪资是多少？ 10k-20k

// 解析参数,放到最后面
program.parse(process.argv)