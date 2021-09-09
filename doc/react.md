1、关键词  
requestIdleCallback 向浏览器申请一段空闲时间执行指定任务
react 通过messageChange+requestAnimationFrame 来模拟requestIdleCallback

- react 17为什么废弃componentWillMount、componentWillReceivedProps、componentWillUpdate
    - 因为用了fiber将组件的渲染进行了分片(一个组件的渲染会分为多个异步任务来执行),所以一个渲染周期内

- fiber 一个异步任务的执行单元

2、react16的事件合成机制

对于事件的处理，react是将事件委托到document上，先处理元素的原生事件,再处理react的绑定事件，顺序为，
捕获阶段：document => parent => currentEle，先触发捕获阶段绑定的事件
冒泡阶段：currentEle => parent => document，再触发冒泡阶段绑定的事件，最后处理react事件，但是react的事件绑定是先于原生
    
- 合成事件的目的和优势
   - 进行浏览器兼容，React采用的是顶层事件代理机制，能够保证冒泡一致性(在元素上都是通过onClick的形式绑定事件，不支持原生的onclick)。
   - 事件对象可能会被频繁创建和回收，因此React引入事件池，在事件池中获取和释放事件对象
```typescript jsx
    // onClick为冒泡事件
    // onClickCapture为捕获事件
    const ele = <div onClick={() => {}}  onClickCapture={() => {}}>element</div>
```
3、react17的事件合成

react是将事件委托到容器上了(可以让一个页面有多个版本的react,)，不再是document
先执行document捕获再执行react的捕获再执行原生的捕获，再执行原生的冒泡最后是react的冒泡再是document冒泡。
- 阻止冒泡的方式
    - event.stopPropagation 阻止向上冒泡，本元素绑定的其他事件还是会触发
    - event.nativeEvent.stopImmediatePropagation  阻止向上冒泡，本元素绑定的其他事件不会再触发
    
    17中，不再使用event.nativeEvent.stopImmediatePropagation，是因为事件委托到了容器上而不是document,事件只有冒泡到document上才会执行。
- 事件监听器(根据不同的优先级和事件名),根据事件的优先级
  
    - dispatchDiscreteEvent: 处理离散事件
    - dispatchUserBlockingUpdate: 处理用户阻塞事件
    - dispatchEvent: 处理连续事件
    
4、setState的执行过程
    
1. 将setState传入的partialState参数存储在当前组件实例的state暂存队列中。
2. 判断当前React是否处于批量更新状态，如果是，将当前组件加入待更新的组件队列中。
3. 如果未处于批量更新状态，将批量更新状态标识设置为true，用事务再次调用前一步方法，保证当前组件加入到了待更新组件队列中。
4. 调用事务的wrapper方法，遍历待更新组件队列依次执行更新。
5. 执行生命周期componentWillReceiveProps。
6. 将组件的state暂存队列中的state进行合并，获得最终要更新的state对象，并将队列置为空。
7. 执行生命周期componentShouldUpdate，根据返回值判断是否要继续更新。
8. 执行生命周期componentWillUpdate。
9. 执行真正的更新，render。
10. 执行生命周期componentDidUpdate。

5、setState到底是异步还是同步的

setState的方法执行是同步的，只是是否更新需要根据isBatchingUpdate状态

6、react Diff机制
判断组件是否需要更新的依据是key, target, attribute是否相同。
+ 更新：新旧组件key,target一致，但是属性有不同
+ 删除：key相同，target不同
+ 移动：target相同，key不相同，重新遍历剩余元素，如果能找到相同元素，将旧元素的位置调整为新fiber的位置
+ 复用：新旧fiber完全一致

在整个遍历中先找到需要更新的fiber,然后再将剩余的fiber生成一个map,再去遍历一下找出需要移动的fiber,以及需要移动到的位置

7、react事件的执行过程  
  组件通过onClick之类的绑定事件，组件创建和更新时，读取props中的事件属性，通过enqueuePutListener注册事件，将事件挂到document(react17会把事件挂到root节点)上，并
将事件加入到事务队列中，分别对捕获和冒泡阶段的事件处理，最终还是转换成原生事件。事件分发

8. redux的原理
createStore: 创建一个store对象来存储数据和状态
action: 定义一些action,通过调用这些action更新相应的数据
dispatch: 主要用于操作action
reducer: 处理action,返回state,更新状态
redux-saga: 一个中间件用于处理异步请求，也是通过action的形式触发
connect: 将store和view链接，通过mapStateToProps和mapDispatchToProps的形式将state输送到props

### react Fiber
1. react 的原理
   + 目的：为了使react渲染的过程可以中断，可以将控制权交还给浏览器，可以让位给高优先级的任务，浏览器空闲后再恢复渲染。
   对于计算量比较大的js计算和dom计算，就不会显的格外卡顿，而是一帧一帧有规律的执行任务。  
   关于react的中断，为什么不用generator去中断  
   相关的方法都要用*和yield,generator内部有状态
   + 如何判断当前是否有高优先级任务  
    约定一个合理的执行时间(16.6ms)，当超过这个时间，如果任务认为完成，中断当前的任务，将控制权交给浏览器
   + 浏览器在一帧中需要做的事情有哪些？
      + 处理用户输入
      + js的执行
      + requestAnimation的调用
      + 布局 layout
      + 绘制 paint
    上述事情执行完成之后，如果有空余时间则执行requestIdleCallback,如果没有空余时间需要在requestIdleCallback中传入timeout时间，
        当超过这个时间时在下一帧中就会执行。
    + timeout后任务一定要被执行吗？不是的  
        给不同的任务分配不同的优先级  
      Immediate: 最高优先级，这个优先级的任务应该被马上执行
      UserBlocking: 这些任务一般使用户交互的结果，需要及时得到反馈
      Normal: 不需要用户立即感受到变化，比如网络请求
      Idle: 优先级比较低，可以被无线延后执行
      
2. 用过高阶组件，什么是高阶组件，高阶组件用来干什么？  
   1. 什么是高阶组件
       + 简称HOC,
       + 是一个函数
       + 入参是一个组件
       + 返回值是一个新的组件
       + 是一个纯函数，不应该有副作用
   2. 如果书写一个高阶函数
       + 普通函数
       + 装饰器，用法@decorator()组件 => decorator()(组件)
       + 多个高阶组件之间组合
   3. 高阶组件可以干什么？
       + 修改组件的props
       + 修改组件实例: 通过ref的形式拿到组件的实例，ref=然后可以修改它
       + 组件劫持
   
2. 对于新技术的敏感程度，求知欲

















