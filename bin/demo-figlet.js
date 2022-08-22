// 终端打印大型文字

// 获取实例
let figlet = require('figlet')

// 工具库
// 任何一个对象包装成promise
let { promisify } = require('util')
let asyncFiglet = promisify(require('figlet'))

// 第一种方式，callback调用
figlet('Hellow World!', function (err, data) {
  if (err) {
    console.log("something went wrong...");
    console.dir(err);
    return
  }
  console.log(data);
})

// 异步调用
async function run() {
  try {
    let data = await asyncFiglet("vue 3")
    console.log(data);
  } catch (error) {
    console.log(error);
  }

}
run()