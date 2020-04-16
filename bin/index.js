#!/usr/bin/env node

const { Command } = require('commander')
const chalk=require('chalk')
const create=require('./commander/create')
const list=require('./commander/list')

const program = new Command();

program.version(require('../package.json').version,'-v,--version')

program.command('create <project> [originProject]')
  .description(`创建项目,填写${chalk.blue('[originProject]')}，直接拉取远程仓库`)
  .option('-c, --cnpm','使用cnpm安装依赖')
  .option('--no-git','取消自动创建git')
  .action(create)

program.command('list')
  .description('查询默认项目列表')
  .option('-a, --all','查看所有项目列表')
  .action(list)


program.parse(process.argv)
