
// 主要是一些事件的监听，触发。
class Tababel {
    constructor () {

    }
}


class Complier extends Tababel{
    constructor(){
        super()
        this.NodeEnvironmentPlugin = () => {} // 具有文件的读写功能
        this.EntryOptionsPlugin = () => {} // 处理入口模块的id
    }

    run = () => {
        const beforeRun = () => {}
        const run = () => {}
        const compile = () => {

        }

        this.make()
    }

    make = () => {

    }

    // 将配置中的plugin挂载到实例中
    mounted = () => {

    }
}
