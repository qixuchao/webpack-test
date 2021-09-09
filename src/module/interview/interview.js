/**
 * 1、a.x = a = { n: '234'}中，a.x的'.'的优先级高于'='，所以a和b的值都变为{ n: '123', x: undefined(等待赋值a.x) }
 * 2、a.x = a = { n: '234'}中，a = { n: '234'}，切断之前a和之间的引用，此时a变为{ n: '234' }，b还是{ n: '123', x: undefined(等待赋值) }
 * 3、a.x = a = { n: '234'}中, a.x = a，此时b变为{ n: '123', x: { n: '234'} }, a = { n: 234}
 */

var a = { n: '123'}
var b = a;
a.x = a = { n: '234'}

console.log(a.x) // undefined
console.log(b.x) // { n: '234' }

/**
 *  从内存来看 null 和 undefined 本质的区别是什么？
 *  1、全局变量为null，将会被垃圾回收机制回收，属性或者局部变量为null，则是给他们开辟一块空的内存空间。
 *  2、undefined, 将值清空，在JSON.stringify()时，undefined的属性会被清除。
 *  3、对于尚未声明过的变量，只能执行一项操作。
 */

/**
 * 哪些情况下容易产生内存泄漏？
 * 1、意外的全局变量
 * 2、被遗忘的计时器或回调函数
 * 3、脱离 DOM 的引用
 * 4、闭包
 */

/**
 * Promise.all()
 */

Promise.all = function (promiseList) {
    return new Promise((resolve, inject) => {
        let num = 0
        let resultList = []

        let done = function (data, i) {
            resultList[i] = data
            if (num ++ === promiseList.length - 1) {
                resolve(resultList)
            }
        }

        for (let i = 0; i < promiseList.length; i++) {
            promiseList[i].then(function (res) {
                return done(res, i) // 通过闭包的形式缓存res和i
            }, function (res){
                inject(res)
            })
        }

    })
}

/**
    1. 介绍一下最近的项目，你在工作中的亮点
    2. 多个promise链式调用，如何去中断promise
    3. null和undefined的区别(从内存的角度)
    4. 垃圾回收机制的执行周期
    5. 谈一谈react的hook, useEffect中各个参数的作用以及他们的使用场景,
    6. 有过对外的工作经历吗,英语水平怎么样，平时工作中的学习方式？
    7. CDN的回源的原理是什么？
    8. 前端工程化
    9. http1与http2.0的区别
    10. sharkTree的原理
    11. 组件库的构建
 */

/**
 * import 和 require的区别
 * 1、CommonJs模块输出的是一个值的拷贝(文件中的值不会被其他操作干扰)，ES6模块输出的是值的引用。
 * 2、CommonJs模块是运行时加载(会加载文件中的所有方法)，ES6模块是编译时输出接口(只会加载被引用的方法)。
 *
 */



