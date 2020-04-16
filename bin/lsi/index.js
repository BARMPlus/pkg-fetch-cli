#!/usr/bin/env node

const fs=require('fs')
const chalk=require('chalk')
const {Command}=require('commander')
const program = new Command();


function fileTypeColor(path,fileName){ //给不同文件类型设置不同颜色
  let stat=fs.lstatSync(path+'/'+fileName)
  switch (true) {
    case stat.isDirectory():
      return chalk.blue(fileName)
    case stat.isSymbolicLink():
      return chalk.green(fileName)
    default:
      return fileName
 }
}

function ignoreSpotFile (files) { //忽略以.开头的文件
  return files.filter(fileName=>fileName.indexOf('.')!==0)
}

function transformOutputText(path,files,options){
  let space=' '.repeat(10) //空格数量
  if(!options.all)files=ignoreSpotFile(files) //如果没有带上all参数，则忽略.开头的文件
  return files.map((fileName,index)=>{
    let isLine=index&&index%8===0?'\r\n':'' //每8个文件，就换行
    fileName=fileTypeColor(path,fileName)
    return  fileName+space+isLine
  }).join('')
}



program.version(require('../../package.json').version,'-v,--version')
  .option('-a,--all','是否显示隐藏文件')
  .usage('[path]')

program.arguments('[path]')
  .action((path,options)=>{
    try{
      const realPath=path||process.cwd()
      const files=fs.readdirSync(realPath)
      const output=transformOutputText(realPath,files,options)
      console.log(output)
    }
    catch(e){
      console.log(e.toString())
    }
  })


program.parse(process.argv)
