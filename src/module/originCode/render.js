const TAG_ROOT = 'TAG_ROOT' // fiber的根节点
const TAG_HOST = 'TAG_HOST' // 元素dom节点
const PLACEMENT = 'PLACEMENT'
const root = document.querySelector('#root')
const A = {
    type: 'div',
    key: 'A',
    props: {
        style: {},
        children: [
            { type: 'div', key: 'A1', props: {}, children: [] },
            { type: 'div', key: 'A2', props: {}, children: [] },
        ]
    }
}
const rootFiber = {
    tag: TAG_ROOT, // Fiber的类型
    key: 'root', // 组件的key
    stateNode: root, // Fiber对应的正式DOM节点
    props: {
        children: [A]
    }
}

let workInProgress = {}

workInProgress = rootFiber

function workLoop (deadline) {
    while (deadline.timeRemainiding > 1 && workInProgress) {
      workInProgress = performUnitOfWork(workInProgress) // 返回下一个任务
    }
    commitRoot(rootFiber)
}

// 根据dom元素创建fiber对象
const createFiber = (element) => {
    const { type, key, props } = element
    return {
        tag: TAG_HOST,
        type,
        key,
        props
    }
}

function reconcileChildren (returnFiber, nextChildren) {
    let previousFiber = null  // 前一个子节点
    let firstChildrenFiber = null // 第一个子节点

    for (let i = 0; i < nextChildren.length; i++) {
        let newFiber = createFiber(nextChildren[i])
        newFiber.return = returnFiber // 将新fiber的return指向父级的fiber
        if (!firstChildrenFiber) {  // 在这里将各个子节点以sibling的形式串到一起
            firstChildrenFiber = newFiber
        } else {
            previousFiber.sibling = newFiber
        }
        previousFiber = newFiber
    }

    returnFiber.child = firstChildrenFiber
    return firstChildrenFiber
}

function beginWork (workInProgress) {
    let nextChildren = workInProgress.props.children
    return reconcileChildren(workInProgress, nextChildren)
}

function performUnitOfWork (workInProgress) {
    beginWork(workInProgress) // 执行完beginWork后会将fiber的子节点生成fiber结构，指向到child上
    if (workInProgress.child) {
        return workInProgress.child
    }

    while(workInProgress) {
        completeUnitOfWork(workInProgress)
       if (workInProgress.sibling) {
           return workInProgress.sibling
       }
       workInProgress = workInProgress.return;
    }
}

// 根据fiber对象创建真实dom
function completeUnitOfWork (workInProgress) {
    let stateNode = null
    switch (workInProgress.tag) {
        case TAG_HOST:
            stateNode = createStateDom();
            break;
    }
    makeEffectList(workInProgress)
}

function commitRoot (rootFiber) {
    let currentEffect = rootFiber.firstEffect
    while (currentEffect) {
        let flags = currentEffect.flags
        switch (flags) {
            case PLACEMENT:
               commitPlacement(currentEffect);
               break;
        }
        currentEffect = currentEffect.nextEffect
    }
}

function commitPlacement (currentEffect) {
    let parent = currentEffect.return.stateNode
    parent.appendChild(currentEffect.stateNode)
}

function makeEffectList (completeWork) {
    let returnFiber = completeWork.return
    if (returnFiber) {
        if (!returnFiber.firstEffect) {
            returnFiber.firstEffect = completeWork.firstEffect
        }
        if (completeWork.lastEffect) {
            if (returnFiber.lastEffect) {
                returnFiber.lastEffect.nextEffect = completeWork.firstEffect
            }
            returnFiber.lastEffect = completeWork.lastEffect
        }
        if (completeWork.flags) {
            if (returnFiber.lastEffect) {
                returnFiber.lastEffect.nextEffect = completeWork
            } else {
                returnFiber.firstEffect = completeWork
            }
            returnFiber.lastEffect = completeWork
        }
    }
}

function createStateDom (fiber) {
    if (fiber.tag === TAG_HOST) {
        let stateNode = document.createElement(fiber.type)
        fiber.stateNode = stateNode
    }

    return fiber.stateNode
}

workLoop()

























