### 微前端
1. 为什么不用iframe</br>
    + iframe在实现微前端的优势</br>
      提供了浏览器原生的硬核隔离方案，无论是样式隔离，js隔离这些问题统统都被完美解决。
    + iframe难以突破的问题
      + url不同步。浏览器刷新 iframe url状态丢失、后退前进按钮无法使用。
      + UI不同步，DOM结构不共享。想象一下屏幕右下角1/4的iframe里来一个带遮罩层的弹框，同时我们要求这个弹框要浏览器居中显示，还要浏览器resize时自动居中、
      + 全局上下文完全隔离，内存变量不共享。iframe内外系统的通信、数据同步等需求、主应用的cookie要透传到根域名等不同的子应用中实现免登录效果。
      + 慢。每次子应用进入都是一次浏览器上下文重建，资源重新加载的过程。
