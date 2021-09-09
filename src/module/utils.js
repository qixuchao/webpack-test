// delay时间后再执行, 取消之前的操作
export const debounce = (fn, delay) => {
    let timer
    return (...params) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, params)
        }, delay)
    }
}

// delay时间内只执行1次
export const throttle = (fn, delay) => {
    let lastTime = +new Date()
    return (...params) => {
        const now = +new Date()
        const timer = setTimeout(() => {
            clearTimeout(timer)
            if (now - lastTime >= delay) {
                fn.call(this, ...params)
                lastTime = now
            }
        }, delay)
    }
}

export const curry = function (fn, ...args) {
    var length = fn.length;

    args = args || [];

    return function () {

        var _args = args.slice(0),

            arg, i;

        for (i = 0; i < arguments.length; i++) {

            arg = arguments[i];

            _args.push(arg);

        }
        if (_args.length < length) {
            return curry.call(this, fn, _args);
        } else {
            return fn.apply(this, _args);
        }
    }
}

export const curry1 = function (fn, ...args) {
    return fn.length <= args.length ? fn(...args) : curry1.bind(null, fn, args)
}

export class Promise {
    constructor(fn) {
        this.status = 'pending'
        this.onFilledCallbacks = []
        this.onRejectCallbacks = []
        this.value = null
        const self = this

        this.resolve = function (value) {
            if (value instanceof Promise) {
                return value.then(this.resolve, this.reject)
            }
            setTimeout(() => {
                if (self.status === 'pending') {
                    self.status = 'resolved'
                    self.value = value
                    self.onFilledCallbacks.forEach((fn) => {
                        fn(value)
                    })
                }
            }, 0)
        }

        this.reject = (value) => {
            setTimeout(() => {
                if (self.status === 'pending') {
                    self.status = 'reject'
                    self.value = value
                    self.onRejectCallbacks.forEach((fn) => {
                        fn(value)
                    })
                }
            }, 0)
        }

        try {
            fn(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }

    static resolve = (value) => {
        return new Promise((res, rej) => {
            Promise.resolve(value).then((r) => {
                res(r)
            }, (re) => {
                rej(re)
            })
        })
    }

    static reject = (value) => {
        return new Promise((res, rej) => {
            Promise.reject(value).then(() => {
            }, (re) => {
                rej(re)
            })
        })
    }

    then = (onResolved, onReject) => {
        return new Promise((resolve, reject) => {
            let fullfilled = () => {
                try {
                    const result = onResolved(this.value)
                    return result instanceof Promise ? result.then(resolve, reject) : resolve(this.value)
                } catch (e) {
                    return reject(value)
                }
            }
            let rejected = () => {
                try {
                    const result = onReject(this.value)
                    return result instanceof Promise ? result.then(resolve, reject) : reject(this.value)
                } catch (e) {
                    return reject(value)
                }
            }

            switch (this.status) {
                case 'pending':
                    this.onFilledCallbacks.push(onResolved)
                    this.onRejectCallbacks.push(onReject)
                    break
                case 'onResolved':
                    return fullfilled()
                case 'onRejected':
                    return rejected()
            }
        })
    }
}

const fetchUrl = (url) => {
    return fetch(url)
}

export class BatchUrl {
    constructor(options) {
        this.max = options.max || 100
        this.urls = options.urls || []
        this.count = 0
        this.enque = []
        this.callback = options.callback
        this.init()
    }

    init = () => {
        this.urls.forEach((url) => {
            const promise = Promise.resolve(url)
            this.enque.push(promise)
            this.run()
        })
    }

    run = () => {
        if (!this.enque.length || this.count === this.max) {
            // this.callback && this.callback()
            return
        }
        this.count ++
        const fn = this.enque.shift()
        fn.then((res) => {
            console.log(res)
            this.complete()
        }, (rej) => {
            this.complete()
        })
    }

    complete = () => {
        this.count--
        this.run()
    }
}



