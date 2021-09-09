
Function.prototype.call = function(context, ...params) {
    const key = Symbol()   // 每次调用方法生成一个唯一的标识，
    context[key] = this    // this指向调用的函数
    context[key](...params)
    delete context[key]
}

Function.prototype.apply = function(context, params) {
    const key = Symbol()
    context[key] = this
    context[key].call(context,...params)
    delete context[key]
}


Array.prototype.reduce = function (fn, initialValue) {
    for (let i = 0; i <= this.length; i++) {
        if (initialValue === undefined) {
            initialValue = fn.call(null, this[i], this[i+1])
            i++ // 将i+1的值跳过，否则else中会重复操作
        } else {
            initialValue = fn.call(null, initialValue, this[i])
        }
    }
    return initialValue
}


function Parent(name) {
    this.name = name;
    this.colors = ['red', 'blue', 'green'];
}
Parent.prototype.getName = function () {
    return this.name;
}

function Child(name, age) {
    Parent.call(this, name); // 调用父类的构造函数，将父类构造函数内的this指向子类的实例
    this.age = age;
}

//寄生组合式继承
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

Child.prototype.getAge = function () {
    return this.age;
}

let girl = new Child('Lisa', 18);
girl.getName();
