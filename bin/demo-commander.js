// 命令行

// 通过commander解构一个program
const { program } = require('commander')
// 设定版本号
program.version('0.0.1')

// 指定一个参数
program.option("-n", "输出名称")
program.option("-t --type <type>", "项目类型")


// 输出
//  node .\bin\demo-commander.js -n
const options = program.opts()
// 打印
console.log("opts=>", options); //opts=> { n: true }

// 定义一个命令行
// node .\bin\demo-commander.js create demo-1
program
  .command("create <app-name>")  // 解析
  .description("创建一个标准的vue项目") //干什么的
  .action(name => {    // 动作
    console.log("正在创建项目，名字：" + name); //正在创建项目，名字：demo-1

  })

// 解析参数,放到最后面
program.parse(process.argv)