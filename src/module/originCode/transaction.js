// invariant库 是用来处理错误抛出的 不必深究
var invariant = require('invariant');

// OBSERVED_ERROR只是一个flag位，后面会解释
var OBSERVED_ERROR = {};
var TransactionImpl = {
    // 初始化和重新初始化都会调用reinitializeTransaction
    //`wrapperInitData`用于后面的错误处理的，可以先不理会
    reinitializeTransaction: function() {
        this.transactionWrappers = this.getTransactionWrappers();
        if (this.wrapperInitData) {
            this.wrapperInitData.length = 0;
        } else {
            this.wrapperInitData = [];
        }
        this._isInTransaction = false;
    },

    _isInTransaction: false, // 标志位，表示当前事务是否正在进行
    getTransactionWrappers: null, // getTransactionWrappers前面提到过，需要使用时手动重写，所以这里是null

    // 成员函数，简单工具用于判断当前tracsaction是否在执行中
    isInTransaction: function() {
        return !!this._isInTransaction;
    },

    // 核心函数之一，用于实现【包裹动作的函数】
    perform: function(method, scope, a, b, c, d, e, f) {
        /* eslint-enable space-before-function-paren */
        invariant(
            !this.isInTransaction(),
            'Transaction.perform(...): Cannot initialize a transaction when there ' +
            'is already an outstanding transaction.',
        );
        // 用于标记是否抛出错误
        var errorThrown;
        // 方法执行的返回值
        var ret;
        try {
            // 标记当前是否已经处于某个事务中
            this._isInTransaction = true;
            // Catching errors makes debugging more difficult, so we start with
            // errorThrown set to true before setting it to false after calling
            // close -- if it's still set to true in the finally block, it means
            // one of these calls threw.
            errorThrown = true;
            // initializeAll
            this.initializeAll(0);
            ret = method.call(scope, a, b, c, d, e, f);
            // 如果method执行错误 这句就不会被正常执行
            errorThrown = false;
        } finally {
            try {
                if (errorThrown) {
                    // If `method` throws, prefer to show that stack trace over any thrown
                    // by invoking `closeAll`.
                    try {
                        this.closeAll(0);
                    } catch (err) {}
                } else {
                    // Since `method` didn't throw, we don't want to silence the exception
                    // here.
                    this.closeAll(0);
                }
            } finally {
                this._isInTransaction = false;
            }
        }
        return ret;
    },

    //  执行所有的前置函数
    initializeAll: function(startIndex){
        var transactionWrappers = this.transactionWrappers;
        for (var i = startIndex; i < transactionWrappers.length; i++) {
            var wrapper = transactionWrappers[i];
            try {
                /**
                 * 这里为什么这样写？
                 * 当某个事务的初始化代码报错，将这个事务标记下，close时就不用执行对应的close了
                 */
                this.wrapperInitData[i] = OBSERVED_ERROR;
                this.wrapperInitData[i] = wrapper.initialize
                    ? wrapper.initialize.call(this)
                    : null;
            } finally {
                if (this.wrapperInitData[i] === OBSERVED_ERROR) {
                    try {
                        this.initializeAll(i + 1);
                    } catch (err) {}
                }
            }
        }
    },


    // 执行所有的后置函数
    closeAll: function(startIndex) {
        invariant(
            this.isInTransaction(),
            'Transaction.closeAll(): Cannot close transaction when none are open.',
        );
        var transactionWrappers = this.transactionWrappers;
        for (var i = startIndex; i < transactionWrappers.length; i++) {
            var wrapper = transactionWrappers[i];
            var initData = this.wrapperInitData[i];
            var errorThrown;
            try {
                errorThrown = true;
                if (initData !== OBSERVED_ERROR && wrapper.close) {
                    wrapper.close.call(this, initData);
                }
                errorThrown = false;
            } finally {
                if (errorThrown) {
                    try {
                        this.closeAll(i + 1);
                    } catch (e) {}
                }
            }
        }
        this.wrapperInitData.length = 0;
    },
};

module.exports = TransactionImpl;
