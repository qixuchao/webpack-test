const isFunction = (f) => {
    return typeof f === 'function';
};

const isPromise = (f) => {
    return f === Promise.constructor;
};

const isThenable = (f) => {
    return f.hasOwnProperty('then');
};

export default class Promise {
    constructor(f) {
        // this.state = 'pending';
        this.callbacks = [];
        this.result = null;
        Promise.init(f);
    }

    state = 'pending'

    static init(f) {
        if (isFunction(f)) {
            try {
                f(Promise.resolve, Promise.reject);
            } catch (e) {
                Promise.reject(e);
            }
        }
    }

    static handleCallback(callback, state, result) {
        const { onFulFilled, onRejected, resolve, reject } = callback;
        try {
            if (state === 'fulfilled') {
                isFunction(onFulFilled) ? resolve(onFulFilled(result)) : resolve(result);
            } else if (state === 'rejected') {
                isFunction(onRejected) ? reject(onRejected(result)) : reject(result);
            }
        } catch (e) {
            reject(e);
        }
    }

    static handleCallbacks(callbacks, state, result) {
        while (callbacks.length) {
            Promise.handleCallback(callbacks.shift(), state, result);
        }
    }

    static transition(promise, status, value) {
        console.log(promise)
        if (promise.state !== 'pending') return;
        promise.state = status;
        promise.result = value;
        setTimeout(() => {
            Promise.handleCallbacks(promise.callbacks, status, value);
        }, 0);
    }

    static onFulFilled(value) {
        return Promise.transition(this, 'fulfilled', value);
    }

    static onRejected(reason) {
        return Promise.transition(this, 'rejected', reason);
    }

    static resolvePromise(promise, value, onFulFilled, onReject) {
        if (value === promise) {
            let reason = new TypeError('');
            return onReject(reason);
        }

        if (isPromise(value)) {
            return value.then(onFulFilled, onReject);
        }

        if (isThenable(value)) {
            let then = value.then;
            if (isFunction(then)) {
                return new Promise(then.bind(value)).then(onFulFilled, onReject);
            }
        }
        return onFulFilled.call(this, value)
    }

    static resolve(value) {
        if (Promise.ignore) {
            return;
        }
        Promise.ignore = true;
        console.log(this, Promise.resolvePromise(this, value, Promise.onFulFilled, Promise.onRejected()))
        return Promise.resolvePromise(this, value, Promise.onFulFilled, Promise.onRejected());
    }

    static reject(reason) {
        if (Promise.ignore) {
            return;
        }
        Promise.ignore = true;
        Promise.onRejected(reason);
    }

    then(onFulFilled, onReject) {
        return new Promise((resolve, reject) => {
            let callback = { onFulFilled, onReject, resolve, reject };
            if (this.state === 'pending') {
                this.callbacks.push(callback);
            } else {
                setTimeout(() => {
                    Promise.handleCallback(callback, this.state, this.result)
                }, 0)
            }
        });
    }

    static all(promise) {
        return new Promise((resolve, reject) => {
            let result = [];
            for (let p = 0; p < promise.length; p++) {
                promise[p].then((data) => {
                    result[p] = data;
                    if (result.length === promise.length) {
                        resolve(result);
                    }
                }, (error) => {
                    reject(error);
                });
            }
        });
    }

    static race(promise) {
        return new Promise((resolve, reject) => {
            for (let p = 0; p < promise.length; p++) {
                promise[p].then((data) => {
                    resolve(data);
                }, (error) => {
                    reject(error);
                });
            }
        });
    }

    static promisify(fn) {
        return (...rest) => {
            return new Promise((resolve, reject) => {
                fn.apply(null, rest.concat((error) => error ? reject(error) : resolve(rest[1])));
            });
        };
    }

    catch(onReject) {
        return this.then(null, onReject);
    }
}

Promise.ignore = false
