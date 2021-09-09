### webpack中用到的配置
1. 通过webpack实现codeSplit
    通过import('')和require.ensure('').default 
2. plugins和loaders的区别
   loader: 文件加载器能够加载资源文件，对这些文件进行一些处理，最终打包到指定文件中， A.less => A.css  
   plugins: 在webpack的生命周期内plugin监听这些事件，在合适的时机通过webpack提供的api改变输出结果
3. sharkTree的实现原理,webpack已内置这个功能
    依赖的是es6 import的动态加载特性，查看被引用模块的名称，剔除没有引用的模块.
   通过--optimize-minimize可以将没有执行到的代码片段删除
4. splitChunk
   根据自己需求对产物进行分包，默认会将你用到的模块打包到一个文件中，这个文件会比较大，首次加载时会影响页面渲染
5. Gzip  
    通过webpack的compressionPlugins来配置打包的产物，支持.gz的文件，然后在nginx上配置相关gz的配置
   如何看gz生效呢，
6. ImageminPlugin, ImageminWebp  
    将图片转化成webp的形式
7. HappyPack
    将打包分为多个线程，加快打包编辑的速度
  
