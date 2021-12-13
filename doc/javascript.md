 ### javascript
#### 事件循环
1. 为什么js在浏览器中有事件循环机制  
 js是单线程的，event loop 的出现来实现非阻塞的事件
2. 微任务和宏任务  
宏任务：主线程的代码块， setTimeout, serInterval, I/O操作  
微任务：Promise.resolve().then(), MutationObserver(监听页面元素或者属性变化时触发)
3. 为什么同时需要微任务和宏任务  
如果只有宏任务，要想在任务之前插入优先级高的任务，就无法做到
4. node中的事件循环和浏览器中的事件循环有什么区别  
node中的事件循环

#### for...in 和 for...of的区别
1. 都可以遍历对象和数组，只不过for...in遍历时拿到的是key,并且会遍历对象原型链上的可枚举属性(属性是否支持enumerable)，比较消耗性能；
   而for...of遍历的是的value,允许遍历一个含有iterator接口的数据结构，普通对象在遍历是会报错，必须给对象增加[Symbol.iterator]属性，
   让对象可以迭代。
2. 如何让普通对象可以使用for...of
```javascript
let obj = {
    name: '13123',
    age: 12
}
// 1. 通过Array.from
obj = Array.from(obj);
// 2. 通过设定属性的[Symbol.iterator]
obj[Symbol.iterator] = function() {
    let keys = Object.keys(this)
    let count = 0
    return {
        next: function(){
            if (count > keys.length) {
                return { value: obj[keys[count++]], done: false }
            }
            return { value: obj[keys[count++]], done: true }
        }
   }
} 
// 3. 通过yield的方式
obj[Symbol.iterator] = function * () {
const keys = Object.keys(this)
for (let v of keys) {
    yield [k, obj[k]]
}
}
for (let value of obj) {
    console.log(value)
}
```
#### 日常代码整理
+ `Math.random()`生成随机数的替换方案
```typescript
const getRandom = () => {
  const _array = new Uint32Array(1); // 创建一个长度为1,元素为32字节长度的非负整数
  const crypto = window.crypto || window.webkitCrypto || window.mozCrypto || window.oCrypto || window.msCrypto; // 兼容各个浏览器
  try {
    crypto.getRandomValues(_array);
  } catch (e){
    _array[0] = + new Date()
  }
  return _array[0];
}
```
+ 对接口返回的带转义符的json字符串进行 `JSON.parse`时老是报错，但复制出来进行 `JSON.parse`时没有问题。
```typescript
// 通过eval(),
```

郭老师，有两个问题需要确认下：
1、部门名称前可以多选，选择上级部门将自动选择勾选下级部门，且下级部门勾选框置灰不可反选。 
关于这个需求，如果勾选了上级部门，该上级部门下的所有子部门都是勾选+置灰状态，且右边的部门列表只显示勾选的上级部门。如果是从下级子部门开始勾选，勾选了所有的子部门
这个时候这些子部门的上部门需要选中吗？
2、勾选后，右侧显示已选部门的数量和名称，可以点击“x”删除选中部门。
关于选择的部门列表展示这块，列表中展示的只展示点击选中的部门呢，还是也要展示勾选部门的子部门呢？
