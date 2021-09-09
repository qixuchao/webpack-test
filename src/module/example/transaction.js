import Transaction from '../originCode/transaction'

var emptyFunction = () => {}

var ReactDefaultBatchingStrategy = {

}

var ReactUpdates = {}

var handlerFunc = () => {
    console.log(12331)
}

var RESET_BATCHED_UPDATES = {
    initialize: emptyFunction,
    close: function() {
        ReactDefaultBatchingStrategy.isBatchingUpdates = false;
    },
};

var FLUSH_BATCHED_UPDATES = {
    initialize: emptyFunction,
    close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates),
};

var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];

function ReactDefaultBatchingStrategyTransaction() {
    this.reinitializeTransaction();
}

Object.assign(ReactDefaultBatchingStrategyTransaction.prototype, Transaction, {
    getTransactionWrappers: function() {
        return TRANSACTION_WRAPPERS;
    },
});

var transaction = new ReactDefaultBatchingStrategyTransaction();

transaction.perform(handlerFunc)
