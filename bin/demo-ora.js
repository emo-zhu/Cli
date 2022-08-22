// import ora from 'ora';
// package.json 需要添加  "type": "module",才支持import  加了就不支持 require 了

const ora = require('ora')
const spinner = ora('Loading unicorns').start();

setTimeout(() => {
  spinner.color = 'yellow';
  spinner.text = 'Loading rainbows';
  spinner.stop()
}, 3000);
