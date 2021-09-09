/**
 * 计算任意数的任意组合
 * @param n 可组合的数据源，比如1，2，3 ...n
 * @param k 每个组合中的成员数 如果k=2 [1,2],[1.3]...
 */

export const combine = (n:number, k:number) => {
    let ret:Array<any> = []

    const recursive = (start: number, combine: Array<any> = []) => {
        if (combine.length === k) {
            ret.push(combine)
            return
        }
        let rest = k - combine.length
        for (let i = start; i <= n; i++) {
            if (n - i + 1 < rest) { // 去除数据源长度不够的情况，n =3 k =2, 此时i = 3时,并且还未生成组合会变成【3】，他是不满足要求的
                continue
            }
            recursive(i+1,combine.concat(i)) // combine.concat(i) 每次传入的都是一个新的数组
        }
    }

    recursive(1, [])

    return ret
}

interface TreeNode {
    var?: number
    right?: null | {}
    left?: null | {}
}

export const viewTreeRight = (root:TreeNode) => {
    const result: Array<number> = []
    if (root) {
        let i = 0
        const findNode = (root: null | TreeNode) => {
            let nodeList = [root]
            if (nodeList.length) {
                const currentNode = nodeList.shift()

                if (result.length === (1 << i) - 1) {
                    result.push(currentNode.var)
                }

                currentNode.right && findNode(currentNode.right)
                currentNode.left && findNode(currentNode.left)
                i++

            }
        }
    }
    return result
}


/*
    二叉树的遍历(前序遍历)
    {
     val: 1,
     left: {
        val: 2,
        left: {},
        right: {}
     }
     right: {
        val: 3,
        left: {},
        right: {},
     }
    }

 */

export const preNodeFind = (node: TreeNode):Array<number> => {
    let valList: number[] = []
    const find = (_node: TreeNode) => {
        if (_node) {
            // 前，中，后序遍历是只需要调整他们的执行循序即可
            valList.push(_node.var)
            find(_node.left)
            find(_node.right)
        }
    }
    find(node)
    return valList
}

/*
    createObject
 */

const createObject = (prototype: any): any => {
    function Fn () {}
    Fn.prototype = prototype
    // return new Fn()
}

/*
    new 的作用
    1、创建一个新对象
    2、将被调用函数中的this指向要返回的这个对象
    3、返回一个对象(如果函数有return并且是一个对象则返回这个对象，否则返回之前新建的对象)

 */

const _new = function (fn: Function, ...args: any[]) {
    let obj = new Object(fn.prototype)

    let returnObj = fn.apply(obj, ...args)

    if (({}).toString.call(returnObj) === '[object Object]') {
        return returnObj
    }

    return obj
}

interface A {
    name: string
}


class B implements A{
    name = ''
    constructor() {
    }
}

function a<T> (arg:T) {

}
