### jsBridge与客户端之间的通信方式
1. JS调用Native
   - 拦截URL scheme  
     通过拦截H5页面的网络请求，iframe,获取路径上的参数进行操作。
   - 重写prompt等原生js方法  
     一般会通过修改浏览器的部分 Window 对象的方法来完成操作。主要是拦截 alert、confirm、prompt、console.log 四个方法，分别被 Webview
     的 onJsAlert、onJsConfirm、onConsoleMessage、onJsPrompt 监听
   - 注入API  
    基于`webview`提供的能力，我们向Window上注入对象或者方法。JS通过这个对象或者方法进行调用时，执行对应的逻辑操作，可以直接调用Native的 
     方法。使用该方法时，JS需要等到Native执行完成对应的逻辑后才能回调里面的操作。  
     android: window.NativeApi.share()、window.androidJsBridge.handleNativeMethod(namespace, params)  
     ios: window.webkit.messageHandlers.share.postMessage()
2. Native调用JS
    只需要将js的方法暴露在Window上给native调用即可。客户端可通过evaluateJavaScript来执行js.
### vue与react的区别
#### 相似之处
   - 都将注意力集中保持在核心库，而将其他功能如路由和全局状态管理交给相关的库
   - 都有自己的构建工具，能让你得到一个根据最佳实践设置的项目模板。
   - 都使用了Virtual DOM（虚拟DOM）提高重绘性能
   - 都有props的概念，允许组件间的数据传递
   - 都鼓励组件化应用，将应用分拆成一个个功能明确的模块，提高复用性
#### 不同的点
1. 数据流  
vue默认支持数据双向绑定，而React一直提倡单向数据流
2. 虚拟DOM更新策略有差异  
    vue:虚拟dom树只做平级的对比   
    react: 会深层次进行比较
    
3. 组件化  
React与Vue最大的不同是模板的编写  
   - Vue 鼓励写近似常规HTML的模板。写起来接近标准的HTML元素，只是多了一些属性。
   - React推荐你所有的模板通用javaScript的语法扩展 --- jsx(js的拓展，增加了一个Node类型)
    具体来说: React中render函数是支持闭包特性的，所以我们import的组件在render中可以直接调用。但是Vue中，由于使用的数据都必须挂在this
     上进行一次中转，所以import完组件之后，还需要在component中再声明下。
4. 监听数据变化的实现原理不同
   vue是通过Object.defineProperty()代理了data对象的getter和setter方法，在你设置值的时候可以监听到
   react 通过比较数据的引用来判断数据是否有变化，因为react的数据是不可变的
5. 高阶组件
  vue通过mixins来扩展现有组件的功能，react通过高阶组件及高阶函数
6. 本质的区别
    vue是一套构建用户界面的渐进式()框架,只关心视图层，易上手。    
    react是一个构件用户界面的js库
7. vue双向绑定的原理  
   v-model: 绑定的是可输入的元素，通过元素的input事件去更新data中绑定的属性
8. vue

### js兼容性的处理
1. 通过@babel/preset-env告诉loader将es6语法处理成js的代码  
   
2. 通过@babel/polyfill 对所有的js做兼容处理，安装完这个依赖后只需要在需要处理的js文件引入这个依赖，但是会有个问题他会对所有的js都做polyfill处理
导致打包的文件会比较大。
3. core-js主要是解决polyfill对js兼容处理的按需加载，用到哪些才会处理哪些，分别对
```json
{"presets": [
    [
        "@babel/preset-env",
        {
            // 指定按需加载
            "useBuiltIns": "usage",
            // 指定core-js的版本
            "corejs": {
                "version": 3
            },
            // 指定兼容的浏览器版本
            "targets": {
                "chrome": "60",
                "firefox": "60",
                "ie": "9",
                "safari": "10",
                "edge": "17"
            }
        }
    ]
]
}
```
### Async/Await 如何通过同步的方式实现异步
首先依赖generator,将异步方法转化为一个可迭代的对象(一个单向列表)
一个对象要变成可迭代

### jquery中的$(function(){})与原生window.onload的区别
jquery:  是在dom结构加载完就会执行，如果有多个每个都会执行  
window.onload: 需要页面的资源都加载完，包括图片，只会执行一次，如果有多个只会执行最后一个

### object和map和weakMap的区别
object: 通过键值对的形式存贮数据，key只能是string或者Symbol，有一个额外的原型属性，key的顺序时无序的  
map: key可以是任意值，是有顺序的按照插入的顺序返回.通过size获取属性个数，可以直接迭代，在增加和删除属性时性能比较好， 
map.set(), get, has, delete, clear, keys, values, entries, forEach  
weakMap: key是一个弱引用类型，必须是对象。 
```javascript
    let obj = {
      name: '1231'
    };
    let map = new Map()
    map.set('obj', obj)
    map.get('obj')  // { name: '123' }
    
    obj = null // 标识可以被回收
    map.get('obj') // { name: '123' } 因为是强引用，obj还在被map一直引用着，所以obj=null时，不会被垃圾回收机制回收掉

```
```javascript
    let obj = {
        name: '1231'
    };
    let map = new WeakMap()
    map.set(obj, 'obj')
    map.get(obj)  // { name: '123' }
    
    obj = null // 标识可以被回收
    map.get(obj) // undefined 因为是弱引用，所以被引用的对象被赋值为null时，会被垃圾回收机制回收，也是因为这个原因导致在迭代时会获取不到一些key
```
   - 弱引用: 不会被垃圾回收机制回收，
   - 强引用: 会被垃圾回收机制回收，

### 为什么不能用数组下标作为组件的key
在对数组组件进行操作时，如果将index作为key, 删除前面的元素，后面的所有元素都会更新一遍，因为key没有变，所有的组件内容都更改了，如果数据量比较大
则会存在比较大的性能损耗。

### CDN是什么，怎么用，CDN的回源策略是什么

### 小程序端如何进行异常监控？什么是染色测试，如何进行染色测试

### nginx

### 前端性能优化的点
1. 首屏加载时间
2. 首次可交互时间
3. 首次有意义内容的渲染时间  
优化方式
   1. 只请求当前需要的资源  
      路由按需加载，图片懒加载，动态polyfill
   2. 缩减文件体积  
      打包压缩包括了Gzip， treeSharking   
      图片格式的优化，压缩，根据屏幕分辨率展示不同分辨率的图片，webp图片   
      尽量控制cookie的大小，
   3. 时序优化
      js,promise.all   
      preload, dns-prefetch, prerender  
      `<link rel=>`
   4. 合理利用缓存
      cdn, cdn预热(在访问之前将资源分发到其他的cdn节点上)，cdn刷新(强制回源)
      
如果一段js执行时间比较长，如何去分析
### 

内存的生命周期
内存分配： 申明变量
内存使用： 读写内存，使用变量
内存回收： 使用完毕垃圾回收机制回收不再使用的内存

引用计数法： 对象是否有指向它的引用，  循环引用  
标记清除法： 不再使用的对象
对所有的对象都有标记，将从根部触发能够触及到的对象清除标记
剩下的有标记的就是待回收的内存对象

内存泄漏
全局变量
未被清除的定时器和回调
闭包
dom引用

减少全局变量
解除引用 对象属性设置为null
避免死循环持续进行

内存占据的字节数
string: string.length * 2
boolean: 4
number: 8
null: 0
undefined: 0

    
   
   


