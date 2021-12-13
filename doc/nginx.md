### MACOS nginx本地安装(通过brew)
一般通过 `brew install nginx`会失败，是因为包的仓库地址在国外，下载会超时就失败了，所以需要改变brew下载包的源地址；
1. 替换 `brew.git`的地址
```shell
cd "$(brew --repo)"
git remote set-url origin https://mirrors.aliyun.com/homebrew/brew.git
```
2. 替换 `homebrew-core.git`的地址
```shell
"$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.aliyun.com/homebrew/homebrew-core.git
```
3. 更新 `brew`
```shell
brew update
```
4. 再去安装 `nginx`
```shell
brew install nginx
```
5. 启动 `nginx`
```shell
cd usr/local/Cellar/nginx/1.21.4/bin
./nginx
```
6. 需要到指定目录下才能启动nginx, 不怎么方便，所以需要调整下配置
```shell
ln -s /usr/local/nginx/sbin/nginx /usr/local/sbin/nginx
```

### nginx常用配置
+ 代理本地资源
```shell
server {
  listen port;
  server_name serverName;
}

location /request_path/images/ {
  root /local_path/images/;
}

location /request_path/images/ {
  alias /local_path/images/;
}
```
**`root`与`alias`的区别**<br>
root: 请求的是serverName/request_path/images/..,实际是root+location的目录下查找文件<br>
alias；是别名的意思，就是请求的是serverName/request_path/images/..,实际上查找到的目录是alias后面对应的目录<br>
**当使用正则表达式时，proxy_pass后面不能加URL_part**
```shell
location ~ /test.html$ {
  # 这样是错误的
  # proxy_pass https://www.baidu.com/index;
  proxy_pass https://www.baidu.com;
}
``` 
+ **快速实现简单的访问限制** 设置网站可访问的网络ip的权限
```shell
location / {
  deny 192.168.1.100;
  allow 192.168.1.10/200;
  deny all;
}
```
其实deny和allow是ngx_http_access_module模块（已内置）中的语法。采用的是从上到下匹配方式，匹配到就跳出不再继续匹配。
上述配置的意思就是，首先禁止192.168.1.100访问，然后允许192.168.1.10-200 ip段内的访问（排除192.168.1.100），
同时允许10.110.50.16这个单独ip的访问，剩下未匹配到的全部禁止访问。实际生产中，经常和ngx_http_geo_module模块（
可以更好地管理ip地址表，已内置）配合使用。
+ **跨域解决**
```shell
server {
  listen port;
  server_name serverName;
  # 这里约定代理请求的url的path是以、/apis/开头
  location ^~/apis/ {
    # 这里重写了请求，将正则匹配的第一个()中$1的path,拼接到真正的请求后面，并用break停止后续的正则匹配;
    rewrite ^/apis/(.*)$ /$1 break;
    proxy_pass originURL; 
  }
}
```
+ **适配PC和移动环境** 同一个站点支持PC和移动端展示，根据nginx的内置变量$http_user_agent,获取客户端的userAgent,从而知道是移动
端还是PC.
```shell
location / {
  # 移动，PC适配
  if ($http_user_agent ~* '(Android|webOS|iphone|ipod)') {
   set $mobile_request '1';
   if ($mobile_request = '1') {
     rewrite ^.+ http://mysite-base-H5.com;
   } 
  }
}
```
+ **合并请求** 用一种特殊的请求url(https://www.baidu.com/??1.js,2.js,3.js)规则，将多个资源的请求合并成一个请求，后台nginx会获取各个资源并拼接成一个结果进行返回。
```shell
# 资源请求合并 http-concat
location / {
  concat on; # 是否打开资源合并开关
  concat_types application/javascript; # 允许合并的资源类型
  concat_unique off; # 是否允许合并不同类型的资源
  concat_max_files 5; # 允许合并的最大资源数目
}
```
+ **图片处理** 
+ **修改页面内容**


