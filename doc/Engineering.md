## 前端工程化
### 为什么需要工程化
  解决代码冗余，项目可维护性，提升版本迭代速度等等一系列的问题

### 如何实施前端的工程化
- 静态资源和动态资源的处理
- javascript实现前端业务逻辑
- Html模板文件输出
- 中间层服务，由node提供
- 前端单元测试
- 前端项目部署

实施工程化的步骤
1. 使用webpack构建项目
2. 使用babel编译成js代码，js兼容性处理
3. css预编译
4. 模块化开发
   - 避免命名冲突
   - 便于依赖管理
   - 利于性能优化
   - 提高可维护性
   - 提高代码的可复用性
5. 组件化开发
6. 开发环境的本地服务器与mock服务
7. 规范化约束
   + prettier https://mp.weixin.qq.com/s/EJ98wba1ty2TnZ2SpwzXVg 
8. 项目部署流程
9. 额外的配置
    + sentry(错误收集)

## 前端优化的方式
资源按需加载, 压缩图片，图片预加载，图片懒加载，codeSpilt
1. 客户端Gzip离线包，服务器资源Gzip压缩。
   通过webpack的相关配置，将一些资源文件打包成.gz的格式，然后在nginx上配置相关配置。
2. JS瘦身，Tree shaking，ES Module，动态Import，动态Polyfill。
   + 动态polyfill  
    在你的项目中引入`https://polyfill.alicdn.com/polyfill.min.js` 这个js会根据浏览器的ua生成对应的polyfill,最新chorme是没有的
   + core.js  
    在打包的时候，只对用过的一些方法进行polyfill
3. 图片加载优化，Webp，考虑兼容性，可以提前加载一张图片，嗅探是否支持Webp。  
   通过配置将小于8k的图片转化为base64较少网络请求  
   根据场景进行预加载和懒加载
   使用webp的图片,因为同质量的webp比png,jpg要小。先判断浏览器是否支持webp,
   通过`document.createElement("canvas").toDataURL('image/webp', 0.5)` 如果返回的是`image/webp`
   则是支持的。
4. preload/prefetch，需要配合缓存来使用。
   + preload(必须资源)+ as   
     通过声明向浏览器声明一个需要提前加载的资源，当资源真正被使用的时候立即执行，就无需等待网络的消耗。  
     `<link rel="preload" href="/path/to/style.css" as="style">`  
     当浏览器解析到这行代码就会去加载 href 中对应的资源但不执行，待到真正使用到的时候再执行，另一种方式方式就是在 HTTP 响应头中加上 preload 字段：
   + prefetch(可能会用到的资源)  
     `<script rel="dns-prefetch" src="./js"></script>`  
     告诉浏览器未来可能会使用到的某个资源，会预解析这个资源的地址，浏览器就会在闲时去加载对应的资源，若能预测到用户的行为， 比如懒加载，点击到其它页面等则相当于提前预加载了需要的资源。
   + 细节说明 
    preload和prefetch获取资源后，如果走缓存机制，它将被存储在http缓存中，可以被不同页面所使用。也不会造成二次下载，及时第一次的资源还没有下载完
     这时候也不会有二次下载，会继续等待第一次下载完。  
     preload在页面关闭时会立即终止preload获取资源，而对于prefetch发起的请求是不会中断的。
   + 会触发二次加载的场景
    1. 同一个资源同时使用preload和prefetch
    2. preload的字体不带crossorigin属性，在同域和不同域时都需要。
    + 资源加载的顺序和优先级，优先级越高加载越提前  
    html/css > font > 视图中的图片资源 > 不在视图中的图片资源  
    第一张图片之前阻塞的js > 第一张图片之后阻塞的js > 异步/延迟/插入的脚本
    preload > prefetch, preload的资源可通过as或者type来设置优先级，没有as的属性会被看做异步请求。  
   + async和defer的区别
    defer属性用于脚本的异步加载，在所有元素都加载完之后再去执行  
    async异步加载脚本，加载完了就执行
5. 服务端渲染，客户端预渲染。
6. CDN静态资源
   在分包的时候，将一些库放到CDN上，在页面中引用CDN地址。
7. Webpack Dll，通用优先打包抽离，利用浏览器缓存。
   
8. 骨架图
9. 减少重绘和回流
10. Webpack本身提供的优化，拆包chunk。
    
12. 减少dom操作，如果修改一个元素的多个属性时，可以将多个属性合并使用styleCssText的形式，当然即使你同时修改多个属性，浏览器也会合并这些dom操作
13. 合理使用缓存策略，减少重新请求资源的请求数
14. 防抖节流

