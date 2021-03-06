## 浏览器缓存
### 浏览器缓存的过程
1. 第一次加载资源，发送请求，返回code=200,从服务器将资源文件下载下来并缓存资源文件和response header,供下次使用
2. 第二次加载资源，由于强缓存的优先级较高，先比较当前时间和上次返回200的时差，如果没有超过cache-control设置的
    max-age,则没有过期，命中强缓存，直接读取本地缓存的资源
3. 如果超过max-age,则缓存已过期，这时候需要协商缓存，发送请求时 在request header中增加if-none-match和if-Modified-since
4. 服务器收到请求后，优先根据Etag的值来判断文件是否被修改，如果没有被修改则返回304，否则返回200并更新Etag的值
5. 如果request header中没有Etag，则将if-Modified-since和被请求文件的最后修改时间做对比，如果一直则304，否则更新last-modified的值，并
返回文件，last-modified, 200。

### 资源缓存的位置
1. Service worker：传输协议必须是https
2. Memory cache: 将资源存储在内存中，读取快但是不能缓存不持久
3. Disk cache: 存储在电脑硬盘中，相比memory cache 有较好的容量和实效性

### 协商缓存和强缓存的区别
1. 强缓存  
   使用强缓存策略时，如果缓存资源是有效的，则直接读取缓存，不会再向服务器发送请求,一般通过request header设置expire和cache-control  
   cache-control:  
       public:  资源可以被任何对象缓存，可以是客户端，或者代理服务器  
       private: 只能被用户浏览器缓存  
       no-cache: 需要先和服务器确认资源是否有更新，如果没有更新直接使用缓存  
       no-store: 禁止任何缓存，每次都必须从服务器获取资源  
       max-age=: 单位为秒，设置缓存的最大有效时间范围  
       s-maxage=: 优先级高于max-age=, 仅适用于共享(cdn)缓存
2. 协商缓存  
   协商缓存的条件是在header中设置max-age=.或者cache-control的值为no-store
   协商缓存策略，会先发送请求，服务端根据请求头的参数，来判断是文件是否有更新，是否需要下发最新的资源
   request          response
   if-none-match = etag (优先级更高)
   if-modified-since = last-modified  
   etag和last-modified的区别:  
   1. 两者都存在时，etag的优先级更高
   2. last-modified:   
      1. 有效时间只能精确到秒级，如果资源在每秒内的变化频次比较多时，比较就没那么准确
      2. 某些文件会周期性更新，但是文件内容并没有发生变化，这个时候文件是不用更细的
      3. 某些服务器不能精确的得到文件的更新时间
   3. etag会根据文件内容生成一段加密的字符串，会更精确。文件变更就会执行一定的逻辑，生成字符串，比较消耗内存。
   
   
### 为什么需要浏览器缓存
   - 减少服务器的负担，提高网站性能,一个网页上相同域名的请求同时发送是有上限的
   - 加快了客户端网页的加载速度
   - 减少了多余冗余数据的传输
### 各种刷新的作用
   - F5(刷新按钮): 浏览器对本地的缓存文件过期,请求中会加if-Modified-since和if-none-match,让服务器判断文件是否过期
   - Ctr + F5(强刷): 浏览器对本地的缓存文件过期，但请求中不会带以上参数,当做是第一次请求资源
   - 浏览器地址栏的回车:  浏览器发起请求，按照正常流程，本地检查是否过期，然后服务器检查新鲜度，最后返回内容

## 浏览器安全
## XSS攻击
  1. XSS(跨站脚本)攻击：代码注入攻击。在网站注入恶意脚本，当页面运行时获取用户信息。
  2. 进行xss攻击的方式 
     - 获取页面的数据，如DOM, cookie, localStorage
     - DOS攻击，发送合理请求，占用服务器资源，使用户无法访问服务器
     - 破坏页面结构
     - 流量劫持(将链接指向某网站)
  3. 攻击类型
  4. 如果预防XSS攻击  
    网页使用csp(内容安全策略)，建立白名单，告诉浏览器哪些外部资源可以加载和执行。我们只需要配置规则，如何拦截就交给浏览器了。  
    开启csp的两个中方式： 在http的response header中设置Content-Security-Policy和meta标签中设置
     `<meta http-equiv="Content-Security-Policy" content="form-action 'self';">`
     在response header 中设置`Content-Security-Policy-Report-Only`,只会发送违规日志，对违规不做处理  
     设置cookie时，增加http-only参数，无法通过脚本获取cookie的值
     
### CSRF攻击
   1. CSRF攻击指跨站请求伪造攻击，诱导用户进入第三方网站，
   2. CSRF本质是利用cookie会在同源请求中携带发送cookie给服务器的特点，以此来实现用户的冒充。
   3. 攻击类型
      - get类型的CSRF攻击，在网站的img标签中构建一个请求，当用户打开网站就会自动发起提交
      - post类型的攻击，构建一个隐藏的表单，在打开网站时提交表单
      - 链接类型的攻击，在a标签的href中构建请求，诱导用户点击发送非法请求。

### 中间人攻击
指攻击者与通讯的两端分别创建独⽴的联系, 并交换其所收到的数据, 使通讯的两端认为他们正在通过⼀个私密的连接与对⽅直接对话, 但事实上整个会话都被攻击者完全控制。在中间⼈攻击中，攻击者可以拦截通讯双⽅的通话并插⼊新的内容。

### 有哪些可能引起前端安全的问题?
   1. 跨站脚本(xss),是一种代码注入的方式
   2. iframe滥用：iframe中内容由第三方提供，在其中可以运行js脚本，flas插件，弹出对话框，页面跳转等破坏用户体验
   3. 跨站点请求伪造(csrf): 非法获取或者篡改用户信息或者更新某些状态
   4. 恶意第三方库，日常开发中会依赖第三方库，如果第三方库中存在恶意代码，很容易引起安全问题。

### 网络劫持的几种方式
   1. DNS劫持(属非法行为)
      - DNS强制解析: 通过修改运营商的本地DNS记录,来引导用户流量到缓存服务器
      - 302跳转的方式: 通过监控网络出口的流量, 分析判断哪些内容是可以进行劫持处理的，再对劫持的内容发起302跳转回复，引导用户获取内容
   2. HTTP劫持: 由于http是明文传输,运营商会修改你的http响应内容

### 浏览器输入Url之后都经历了什么？
1. 输入URL对网址进行解析，根据url的组成构造一个http请求，这个时候先走一边浏览器缓存，看这个链接的资源是否有缓存。
2. 发送http请求之前浏览器会去获取访问网址的ip地址，这时候就需要DNS域名解析服务，将域名解析成对应的ip。
    + DNS高速缓存: 浏览器、操作系统、路由器都会缓存一些URL对应的ip地址，这样可以加快DNS的解析速度。
    + DNS负载均衡: 将一个网站放到多个服务器上，当访问量比较大时，返回不同服务器的ip,减少单个服务器的访问量
3. 找到对应IP后就发起了Http请求，首先通过TCP三次握手建立客户端和服务端的连接，这个连接在http1.0之后都是长连接(2小时有效)，下次再发起同一个请求时
就不会再进行TCP连接了，向服务器发送请求。
4. http返回响应内容，浏览器开始渲染页面；
    + 根据HTML页面结构生成dom树
      根据HTML的内容按照标签结构解析成DOM树，以深度优先遍历的形式构建节点的所有子节点。  
      在读取HTML文档，构建DOM树的时候，如果遇到script标签，先执行script中的内容，如果遇到rel=preload,
    + 根据style生成css对象模型  
      cssom构建成功之前页面不会进行渲染
    + dom + cssom合并形成渲染树  
      布局：通过渲染树的渲染对象的信息，计算出每一个渲染对象的位置和尺寸
      回流： 在布局完成后，发现某个部分发生了变化影响了布局，那就需要倒回去重新渲染
    + 渲染页面，将渲染树生成的呈现树呈现到屏幕上
5. 断开连接：TCP四次分手

### 浏览器安全
1. xss
2. csrf
3. csp(内容安全策略，可以禁止加载外域的代码，禁止外域的提交)
4. https
5. HSTS(强制客户端使用https与服务端建立链接)
6. X-Frame-Options(控制当前页面是否可以被嵌入到iframe中) 
7. SRI(子资源的完整性)
8. Referer-policy

### node安全
1. 本地文件操作相关，路径拼接导致的文件泄漏
2. ReDos
3. 时序攻击
4. ip origin referrer request header

























    
