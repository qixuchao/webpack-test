/**
 * const p1 = new MyPromise((resolve, reject) => {
 *  resolve('success');
 *  reject('fail');
 * })
 * 
 * p1.then((resolve) => {
 *    console.log(resolve)
 * }, (reject) => {
 *    console.log(reject)
 * })
 * 
 * 
 */

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {

  constructor(excutor) {
    this.initValue();
    try {
      excutor(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error);
    }
  }

  initValue() {
    this.changeStatus(PENDING, undefined);
    this.fufilledConllection = [];
    this.rejectConllection = [];
  }

  changeStatus(status, data) {
    this.promiseStatus = status;
    this.promiseValue = data;
  }

  resolve(data) {
    if (this.promiseStatus === PENDING) {
      this.changeStatus(FULFILLED, data);

      while (this.fufilledConllection.length) {
        const executor = this.fufilledConllection.shift();
        executor(this.promiseValue)
      }
    }
  }

  reject(error) {
    if (this.promiseStatus === PENDING) {
      this.changeStatus(REJECTED, error);
      while (this.rejectConllection.length) {
        const executor = this.rejectConllection.shift();
        executor(this.promiseValue)
      }
    }
  }

  then(onFulfill, onReject) {
    onFulfill = typeof onFulfill === 'function' ? onFulfill : (val) => val;
    onReject = typeof onReject === 'function' ? onReject : (val) => val;
    const returnPromise = new MyPromise((resolve, reject) => {

      const resolvePromise = function (cb) {
        try {
          const x = cb(this.promiseValue)
          if (x && x === returnPromise) {
            throw new Error('434242')
          }

          if (x instanceof MyPromise) {
            x.then(resolve, reject)
          } else {
            resolve(x)
          }
        } catch (error) {
          reject(error)
        }

      }

      if (this.promiseStatus === FULFILLED) {
        resolvePromise(onFulfill)
      }

      if (this.promiseStatus === REJECTED) {
        resolvePromise(onReject)
      }

      if (this.promiseStatus === PENDING) {
        this.fufilledConllection.push(onFulfill)
        this.rejectConllection.push(onReject)
      }

    })


    return returnPromise;
  }

}

const p1 = new MyPromise((resolve, reject) => {
  resolve('success');
  reject('fail');
})

console.log(p1)