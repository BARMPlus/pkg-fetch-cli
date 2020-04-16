const { exec, spawn } = require('child_process')

const fs = require('fs-extra')
const { program } = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const spinner = ora()

const config = require('./config')


function downloadCode (projectName, originProjectName) {
  return new Promise((resolve) => {
    spinner.start('Loading Template') //下载模板Loading
    const downloadUrl = `direct:https://github.com/${config.gitUser}/${originProjectName}.git`
    download(downloadUrl, projectName, { clone: true }, err => {
      if (err) {
        spinner.fail('Download Template Fail')
        spinner.fail(err.toString())
        process.exit()
      }
      else {
        spinner.succeed('Download Template Success')
        resolve()
      }
    })
  })
}

async function confirmOverviewFilePrompt () {
  return await inquirer.prompt([
    {
      type: 'confirm',
      name: 'isOverview',
      message: '确定覆盖当前项目吗?',
      default: false
    },
  ])
}

async function chooseTemplatePrompt () {
  const projectGather = config.defaultShowProject

  return await inquirer.prompt(
    {
      type: 'list',
      name: 'template',
      message: '请选择基础模板',
      choices: Object.keys(projectGather).map(item => ({
        name: item,
        value: projectGather[item]
      }))
    },
  )
}

async function chooseNpmInstallPrompt () {
  console.log(chalk.blue('项目已经安装成功，是否使用npm安装相关依赖？'))
  return await inquirer.prompt([
    {
      type: 'list',
      name: 'isInstall',
      message: '请选择',
      choices: [
        { name: 'use NPM', value: true },
        { name: 'exit', value: false },
      ]
    },
  ])
}

function npmInstallSpawn (options) {
  spinner.start('Loading dependencies') //下载相关依赖
  let usageRegistry=options.cnpm && 'cnpm' || 'npm'
  usageRegistry= (process.platform === 'win32') ? `${usageRegistry}.cmd` : usageRegistry
  const install = spawn(usageRegistry, ['install', '--registry=https://registry.npm.taobao.org/'])

  install.stdout.on('data', (res) => {
    console.log(res.toString()) //toString将buffer转为汉子
  })
  install.stderr.on('data', (res) => {
    console.log(res.toString())
  })
  install.on('close', () => {
    spinner.stop()
  })

}

module.exports = async function (project, originProject, options) {
  if (fs.existsSync(project)) { //当前目录下是否存在名字为project的项目
    console.log(chalk.red('文件路径已存在'))
    const answers = await confirmOverviewFilePrompt()
    if (answers.isOverview) { //用户确认选择覆盖
      spinner.start('delete Loading')
      fs.removeSync(project)
      spinner.stop()
    }
    else { //取消覆盖
      process.exit()
    }
  }
  if (originProject) { //直接从远程拉取仓库
    await downloadCode(project, originProject)
  }
  else {
    const answers = await chooseTemplatePrompt() //模板选择
    await downloadCode(project, answers.template) //下载代码,拉取失败，会退出进程
  }

  process.chdir(project) //将目录设置到项目目录
  if(options.git)exec(`git init && git add . && git commit -m "init" `) //生成.git文件夹
  const result = await chooseNpmInstallPrompt()
  if (result.isInstall) { //用户确认安装依赖
    npmInstallSpawn(options) //使用npm安装依赖
  }
}


