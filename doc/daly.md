### 安装brew
比较简单粗暴的方式
```shell
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

### webstorm2021破解
1. 下载webstorm2021版，安装，并以免费试用的方式进入，然后打开一个项目
2. 将ide-eval-resetter-2.1.14.jar这个插件直接拖到webstorm的窗口中自动安装
3. 安装完成后会在右下角有个提示，大概就是reset时间，勾选auto然后点击restart就可以了

### 安装nvm
+ 通过命令安装nvm包
```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```
+ 有时候上面的命令无法安装可以直接下载git
``` shell
    cd ~/.nvm
    git clone https://github.com/nvm-sh/nvm.git
```
** 注意点
1. 查看nvm时报如下错误时,可能是之前通过npm安装过nvm需要删除之前的包  
`This is not the package you are looking for: please go to* [*http://nvm.sh*](http://nvm.sh/)`
+ 解決方式: 先將npm內的nvm移除  
`npm uninstall -g nvm`
若还是不行再执行以下指令  
`sudo npm uninstall -g nvm`
2. 如果重启终端后就会失效
```shell
cd ~
touch  .zshrc
vim .zshrc
```
添加以下三行,保存vim然后重启终端
```text
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```
### 安装nrm,配置npm的源
+ 安装nrm
```shell
npm install nrm -g
```
+ 查看源地址列表
```shell
nrm ls
```
