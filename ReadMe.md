# 脚手架开发流程

### 一，初始化项目

```js
1. yarn init || npm init   初始化package.json
question name (v-cli):
question version (1.0.0):
question description: one cli for create project
question entry point (index.js):
question repository url:
question author: emo猪
question license (MIT):
question private:
2. 
```



### 二，插件介绍

#### 1. commander 命令行插件

```js
yarn add commander -S

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
```



#### 2. filet 大型字符-终端打印大型文字

```js
yarn add figlet -S

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
```



#### 3. chalk 彩色文字，美化终端字符显示

```
yarn add chalk -S |yarn add chalk@^4.0.0
```



#### 4. inquirer 命令行参数输入交互

```js
yarn add inquirer -S ||yarn add inquirer@^8.0.0 -S

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
```



#### 5. shelljs

```
yarn add shelljs -S
```



#### 6. ora  loading效果

```js
yarn add ora -S  || yarn add ora@^5.1.2

// import ora from 'ora';
// package.json 需要添加  "type": "module",才支持import  加了就不支持 require 了

const ora = require('ora')
const spinner = ora('Loading unicorns').start();

setTimeout(() => {
  spinner.color = 'yellow';
  spinner.text = 'Loading rainbows';
  spinner.stop()
}, 3000);

```



#### 7. download-git-repo  仓库下载

```js
yarn add download-git-repo -S

let download = require("download-git-repo");
download(
  "direct:https://gitee.com/ting-feng-zhu/vue3_manager_server.git",
  "Demo",
  { clone: true },
  function (err) {
    console.log(err ? "Error" : "Success");
  }
);


```



### 三，脚手架

#### 1.基本流程

```js
1.创建空项目文件夹
2. 通过npm | yarn 初始化package
npm init | yarn init
3. 安装插件
yarn add | npm install
4. 插件bin目录
5. 开发命令行
6. "bin": {
    "v": "./bin/index.js"
  },
```

#### 2. 实现脚手架开发

```js
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
```

#### 3. init项目

```js
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
```

### 四，开发 Low Code

#### 1. VInput

```vue
<template>
  <div>
    <el-input v-model:modelValue="userName" @update:modeValue="handleInput"></el-input>
    <el-button @click="handleSubmit">提交测试</el-button>
  </div>
</template>

<script>
import { ref } from "@vue/reactivity";
export default {
  name: "VInput",
  props: ["modelValue", "title"],
  // 接收父元素传递的
  setup(props, context) {
    let userName = ref(props.modelValue);

    const handleInput = (val) => {
      userName.value = val;
      context.emit("update:modeValue", val);
    };

    const handleSubmit = (value) => {
      context.emit("handleSubmit", userName);
    };

    return {
      userName,
      handleSubmit,
      handleInput,
    };
  },
};
</script>

<style>
</style>
```

##### app.vue

```vue
<template>
  <!-- <router-view></router-view> -->
  <div>
    <v-input
      v-model:modelValue="userName"
      v-model:title="title"
      @handleSubmit="handleSubmit"
    ></v-input>
  </div>
</template>

<script>
import VInput from "./components/VInput.vue";
import { ref } from "@vue/reactivity";
export default {
  name: "App",
  components: { VInput },

  setup() {
    let userName = ref("jack");
    let title = ref("vue3");
    const handleSubmit = (values) => {
      console.log("接收数据", values);
      console.log("当前对象", userName);
    };
    return {
      userName,
      title,
      handleSubmit,
    };
  },
};
</script>
<style lang="scss">
@import "./assets/style/reset.css";
@import "./assets/style/index.scss";
</style>
```



#### 2. package 文件夹 VTable

```

```

##### index

```js
import BaseTable from "./BaseTable.vue";

// install 方法
BaseTable.install = (app) => {
  // 组件注册
  app.component(BaseTable.name, BaseTable)
}


export default BaseTable
```

##### BaseTable.vue

```vue
<template>
  <div class="base-table">
    <div class="action">
      <!-- 插槽 -->
      <slot name="action"></slot>
    </div>
    <!-- v-bind="$attrs" 绑定使用的事件和数据  -->
    <el-table v-bind="$attrs">
      <!-- 包裹表格 -->
      <template v-for="item in columns" :key="item.prop">
        <!-- 复选框 -->
        <el-table-column
          type="selection"
          width="55"
          v-if="item.type == 'selection'"
          key="selection"
        />

        <el-table-column v-bind="item" v-else-if="!item.type">
        </el-table-column>
        <!--  -->
        <el-table-column v-if="item.type == 'action'" v-bind="item">
          <!-- 自定义列 -->
          <template #default="scope">
            <template v-for="(btn, index) in item.list" :key="index">
              <el-button
                :type="btn.type || 'text'"
                size="small"
                @click="handleAction(index, scope.row)"
                >{{ btn.text }}</el-button
              >
            </template>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <el-pagination
      class="pagination"
      background
      layout="prev, pager, next"
      :total="pager.total"
      :page-size="pager.pageSize"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  name: "BaseTable",
  // 定义props
  props: ["columns", "pager"],
  setup(props, { emit }) {
    // 行为
    const handleAction = (index, row) => {
      // 抛回去
      emit("handleAction", { index, row: { ...row } });
    };
    // 分页
    const handleCurrentChange = (pageNum) => {
      emit("handleCurrentChange", pageNum);
    };
    return {
      handleAction,
      handleCurrentChange,
    };
  },
};
</script>

<style>
</style>
```



#### 3. package 文件夹 VForm

##### index.js

```js
import QueryForm from "./QueryForm.vue";

// install 方法
QueryForm.install = (app) => {
  // 组件注册
  app.component(QueryForm.name, QueryForm)
}


export default QueryForm
```

##### QueryForm.vue

```vue
<template>
  <el-form ref="queryForm" :inline="true" :model="queryModel">
    <!--  -->
    <template v-for="(item, index) in form" :key="index">
      <FormItem :item="item" v-bind="item" v-model="queryModel[item.model]" />
    </template>

    <el-form-item>
      <el-button type="primary" @click="handleQuery">查询</el-button>

      <el-button @click="handleReset">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { reactive } from "@vue/reactivity";
/**
 * form =[
 *  typ:"input"
 *  model:"userId"
 *  label:"用户ID"
 *  placeholder="请输入用户ID"
 * ]
 */

import FormItem from "./FormItem.vue";
import { getCurrentInstance } from "@vue/runtime-core";
export default {
  name: "QueryForm",
  props: ["modelValue", "form"],
  // 事件
  emits: ["update:modelValue", "handleQuery"],

  components: { FormItem },
  setup(props, context) {
    const ctx = getCurrentInstance();
    //
    const form = props.form;
    //
    const queryModel = reactive({
      ...props.modelValue,
    });
    //
    const handleReset = () => {
      ctx.refs.queryForm.resetFields();
    };
    //
    const handleQuery = () => {
      // todo
      context.emit("update:modelValue", { ...queryModel });
      // console.log(form);
      context.emit("handleQuery", { ...queryModel });
    };

    //
    return {
      queryModel,
      handleReset,
      handleQuery,
    };
  },
};
</script>

<style>
</style>
```

##### FormItem.vue

```vue
<template>
  <el-form-item :prop="item.model">
    <el-input v-if="item.type == 'input'" v-bind="$attrs" />
    <el-select v-else-if="item.type == 'select'" v-bind="$attrs">
      <el-option
        v-for="option in item.options"
        :key="option.value"
        v-bind="option"
      >
      </el-option>
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  name: "QueryForm",
  props: ["item"],
  setup() {},
};
</script>
 
<style>
</style>
```

##### User.vue

```vue
<div class="query-form">
      <!-- low code -->
      <query-form
        :form="form"
        v-model="user"
        @handleQuery="handleQuery"
      ></query-form>
    </div>



  const form = [
      {
        type: "input",
        model: "userId",
        label: "用户ID",
        placeholder: "请输入用户ID",
      },
      {
        type: "input",
        model: "userName",
        label: "用户名称",
        placeholder: "请输入用户名称",
      },
      {
        type: "select",
        model: "state",
        label: "状态",
        placeholder: "请选择状态",
        options: [
          {
            label: "所有",
            value: 0,
          },
          {
            label: "在职",
            value: 1,
          },
          {
            label: "离职",
            value: 2,
          },
          {
            label: "试用期",
            value: 3,
          },
        ],
      },
    ];

    // 初始化用户表单对象
    const user = ref({
      state: 1,
    });



   // 获取用户列表
    const getUserList = async () => {
      // 获取用户状态和页码
      let params = { ...user.value, ...pager };
      // 调用接口获取数据 params 作为参数
      const { list, page } = await proxy.$api.getUserList(params);
      userList.value = list;
      // console.log(userList.value);
      pager.total = page.total;
    };



  // 查询
    const handleQuery = (values) => {
      console.log(values, user.value);
      // 重新调用用户列表
      getUserList();
    };


return {
form
}
```

#### main

#### data.js

```js
import QueryForm from "./index";
import BaseTable from "./BaseTable";


// 默认导出一个对象
export default {
  install(app) {
    app.use(QueryForm)
    app.use(BaseTable)
  }
}
```



```js
import Rocket from "./../package/data";
 .use(Rocket)
```

