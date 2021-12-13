## react hooks
### 谈谈你对hook的理解
mounted阶段  
在一个函数组件第一次渲染执行上下文过程中，每个react-hooks执行，都会产生一个hook对象，并形成链表结构，绑定在workInProgress的memoizedState属性上，
然后react-hooks上的状态，绑定在当前hooks对象的memoizedState属性上。对于effect副作用钩子，会绑定在workInProgress.updateQueue上，
等到commit阶段，dom树构建完成，在执行每个 effect 副作用钩子。

### useEffect各个参数的作用
1. useEffect每次state更新组建都会去执行，但是回调函数只是在初始化和依赖项更新时执行，useEffect是在dom渲染完成之后再去执行。
2. 方法的第二个参数是一个数组,数组的元素是callback的依赖项，会对数组中的元素进行比较，如果有更新就会执行callback中的逻辑；一般最多支持三个元素
如果依赖元素比较多可进行合并，或者拆分多个useEffect; 如果数组为空，则只会执行一次； 如果元素是一个方法名，需要用useCallback包裹一下
3. 主要的一个作用就是处理副作用函数(副作用是任何会影响正在执行的函数范围之外的内容的东西)  
   API请求，网络套接字，计时器，记录器，甚至是引用中的任何内容
    

### useCallback
缓存函数的引用，不会在状态更新重新渲染的时候重新声明一个新的函数引用  

### useRef
因为useRef返回缓存下来的值，无论执行多少次都可以拿到最新的值，hook.memoizedState指向了一个对象。
组件之间传递ref属性时不要使用ref属性名，它是react中的关键字，需要时可以使用forwardRef
```javascript
import { useRef } from 'react'
const Test = () => {
    const obj = null
    // 这里的obj为null则生成的ref是一个{ current: null }的对象，即current中的值就是obj的值，current是可以修改的，但是ref的引用是不变的，
    // 所以在FC的各个阶段都可以拿到ref的值，而且是最新的(ref是引用类型，引用不变修改其中的属性后可立即拿得到)。
    const ref = useRef(obj)
    ref.current = () => {
        console.log(ref)
    }
}
```

### useMemo
缓存一些引用类型的数据，甚至可以缓存子组件的内容，以子组件的props作为依赖项，来控制组件的渲染。

### useReducer
当组件中的state比较多时，且state之间有相互依赖关系可以使用useReducer,相比较useState它会将state进行合并，而useState中只是互相隔离的打个state
```javascript
import { useState, useReducer } from 'react'
const reducer = (state, action) => {
    switch (action.type) {
        case 'increment': 
            return {
               ...state 
            }
    }
}
const Test = () => {
    
    const [state, dispatch] = useReducer(reducer, { count: 0 })
    const clickButton = () => {
        dispatch({
            type: 'increment',
            payload: {
                count: state.count ++
            }
        })
    }
    
    return (<>
        <span>{state.count}</span>
        <buttont onClick={() => clickButton()}></buttont>
    </>)
}
```

### 为什么hooks不能写在条件语句中
有一个hook对象里面存储的是hooks的状态等等信息，然后每个hook他们之间是有顺序的，上一个hooks执行完在执行下一个，useState => useMemo => useRef
=> useEffect, 如果我们将中间的某个hooks放到条件中，如果执行不到就会破坏之前的memoize的结构。

### 一个面试题的思考(合理使用react hooks 实现一个计时器)
1. 初期的版本
```javascript
import React, { useEffect, useState } from "react";

const useInterval = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            // 1. 这种方式拿到的count永远是0, 因为useEffect只执行一次，会将count的初始值缓存到函数内部, 
            // 需要在useEffect的第二个参数中传入count可实现count更新
            - setCount(count + 1)
            // 2. 这种方式使用useState的回调函数，可以拿到count之前的值，返回最新的state
            + setCount((count) => count + 1);
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return <div>{count}</div>;
};

export default useInterval;
```

2. 使用useRef，返回一个可变的ref对象,这个对象在整个函数生命周期内保持不变，状态是共享的
```javascript
import React, { useEffect, useState, useRef } from "react";

const useInterval = () => {
  const [count, setCount] = useState(0);
  const currentRef = useRef(null);

  currentRef.current = () => {
    setCount(count + 1);
  };

  useEffect(() => {
   // 注意事项: currentRef.current为什么要用函数在外面包一下，直接setInterval(currentRef.current, 1000),会有什么问题呢？
   // 引用复用，用的还是第一次绑定的函数，通过在外层包一层在每次执行的时候创建一个新的作用域，可以拿到最新的值   
    const timer = setInterval(() => {
      currentRef.current();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <div>{count}</div>;
};

export default useInterval;

```

### 父组件如何去调用子组件的方法
1、 通过 `react hooks`的 `useImperativeHandle`这个hook
2、 
