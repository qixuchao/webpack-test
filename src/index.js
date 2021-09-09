import './style/index.less'
import _ from 'lodash'
import Promise from './module/Promise.js'
// import './module/mix'
import { debounce, throttle, curry1, curry, BatchUrl } from './module/utils'

import { viewTreeRight } from './module/letcode.ts'

const test = () => {
    const button = document.createElement('button')
    button.innerText = '确定'
    button.className = 'container'
    document.body.appendChild(button)

    const a = debounce(() => { console.log(12323)})

    a()

    return false;


    button.onclick = function (e) {
        import(/* webpackChunkName: 'lodash' */'lodash').then((_) => {
            console.log(_.map([1, 3.4], (i) => i + 1))
        })
    }
    // Promise.resolve(1231).then((value) => {
    //     console.log(value)
    // })
}

const A = (options) => {
    // this.name = options.name
    // console.log(this.name)
}

const a = new A({ name: 'qixuchao'})

test()
