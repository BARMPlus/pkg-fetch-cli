# pkg-fetch-cli

## Install
```
npm install pkg-fetch-cli -g
```

## Usage

```
pkg create app
```
创建以app为项目名称的文件夹，默认提供app，admin，mpvue三种脚手架提供选择。  
如果提供的app项目名称已经被占用，你可以选择覆盖之前的应用。  
拉取模板以后，你可以直接使用use NPM 进行安装依赖，也可以选择exit拒绝安装。  
创建后，会自动生成git文件，并且进行一次默认提交。
如果不需要该功能，可以使用``--no-git``选项来拒绝。  
可以使用``--cnpm``选项，用cnpm源安装依赖，默认使用淘宝镜像源安装。

```
pkg list -a
```
列出当前所有项目模板    
```
pkg create app sprite-tool
```
这样可以跳过模板选择，直接安装``pkg list``下的项目。

```
lsi
lsi /usr
lsi -a
```
列出当前项目下的文件
