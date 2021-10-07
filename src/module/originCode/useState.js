/**
 * 模拟useState的实现
 *
 */

// 1、 简易版
import React from 'react'
import ReactDom from 'react-dom'

let setter = []
let activityIndex = 0
let stateList = []

const createFunc = (index) => {
    return (state) => {
        stateList[index] = state
        render()
    }
}

const render = () => {
    activityIndex = 0
    ReactDom.render(<App/>, document.querySelector('#root'))
}

const useState = (initialState) => {
    if (typeof initialState === 'function') {
        initialState = initialState()
    }
    let currentState = stateList[activityIndex] = stateList[activityIndex] || initialState
    setter.push(createFunc(activityIndex))
    const value = currentState
    const setValue = setter[activityIndex]
    activityIndex++
    return [value, setValue]
}

const App = () => {
    const [value, setValue] = useState(1)
    return (
        <div>
            <buttono onClick={() => setValue(value + 1)}>+</buttono>
            {value}
        </div>
    )
}

ReactDom.render(<App/>, document.querySelector('#root'))

// 2、 进阶版

