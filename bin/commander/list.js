const { program } = require('commander')
const request = require('request')
const chalk = require('chalk')
const ora = require('ora')
const spinner = ora()

const config = require('./config')

module.exports=function(options){
  spinner.start('Loading...') //拉取列表 loading
  request({
    url: `https://api.github.com/users/${config.gitUser}/repos`,
    headers: {
      'User-Agent': 'project-repos'
    }
  }, (err, res, body) => {
    if (err) {
      spinner.fail('Fetch Fail')
      console.log(chalk.red(err))
      return
    }
    spinner.succeed('Fetch Success')
    let requestBody = JSON.parse(body)
    if (Array.isArray(requestBody)) {
      const defaultProjectArr=Object.values(config.defaultShowProject)
      if(!options.all)requestBody=requestBody.filter(repo=>defaultProjectArr.indexOf(repo.name)!==-1) //如果不展示所有列表，则过滤
      console.log('  Available official templates:')
      console.log()
      requestBody.forEach(repo => {
        console.log(
          '  ' + chalk.yellow('★') +
          '  ' + chalk.blue(repo.name) +
          ' - ' + repo.description)
      })
    }
    else {
      console.error(requestBody.message)
    }
  })
}
