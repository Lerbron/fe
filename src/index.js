'use strict';
const app = require('commander');

app
  .version('1.0.0')
  .command('server', '启动本地server，-p 指定端口')
  .command('build', '发布打包')
  .command('create', '创建新项目')
  .parse(process.argv);
