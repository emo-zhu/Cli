let download = require("download-git-repo");
require('download-git-repo')
download(
  "direct:https://gitee.com/ting-feng-zhu/vue3_manager_server.git",
  "Demo",
  { clone: true },
  function (err) {
    console.log(err ? "Error" : "Success");
  }
);

