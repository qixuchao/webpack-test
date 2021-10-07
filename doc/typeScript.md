### Typescript
#### type interface
type 是interface的别名

#### 泛型
在定义函数、接口或者类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性  
和any不同，any是指任意类型，对传入的类型不做判断，就有约束性是不安全的，

```typescript
    type Partial<T> = {
        [P in keyof T]?: T[P] extends object ? Partial<object> : T[P]
    }
    
    enum Methods {
        get = 'get'
    }
```
#### 常用api
1. keyof T 返回该类型上所有公共属性名的联合
```typescript
  const obj = { a: '1',b: 2 };
  type Foo = typeof obj; // { a: string, b: number }
  type B = keyof obj; // 'a' | 'b'
```
2. extends 接口继承，可以多继承，子接口就拥有了父接口的属性   
** 注意事项  
   如果多继承中父接口中存在类型不同但是属性名相同时，不会像其他语言那样进行合并，而是直接提示错误
```typescript
  interface Shape {
    color: string;
  }
  interface PenStroke {
    penWidth: number;
  }
  interface Square extends Shape, PenStroke {
    sideLength: number;
  }
```
3. infer 只能出现在extends子语句中，用来推断类型变量
```typescript
  // ReturnType 为内置工具类型，作用：由函数类型 T 的返回值类型构造一个类型。
  // 通过infer U 来标记函数的返回值的类型，如果有返回则返回类型，否则返回any
  type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```
+ infer 解包,获取数组中元素的类型

in
&
|
?
-?
+?
never
unkown
any
readonly
void


#### 重载
在进行赋值时，可以将参数参数少的赋值给参数多的，反之就不行。
示例: 约束一个函数的两个参数a,b都支持string和




1、Partial
让接口返回可选类型



类型定义

type Partial<T> = {
[P in keyof T]?: T[P];
};


interface Person {
name: string;
age: number;
}

// error , property age is missing.
const axes: Person = {
name: 'axes'
}

type NewPerson = Partial<Person>;

// correct, because age can be undefined.
const axes: NewPerson = {
name: 'axes'
}

// 等同于

interface Person {
name?: string;
age?: number;
}

不过Partial只支持一层结构



export type PowerPartial<T> = {
// 如果是 object，则递归类型
[U in keyof T]?: T[U] extends object
? PowerPartial<T[U]>
: T[U]
};


3、Pick
从 T 中，选择一组键在并集 K 中的属性。实际就是说在原有的类型 T 上 筛选出想要的全部或极个别的属性和类型

类型定义

/**
* From T, pick a set of properties whose keys are in the union K
  */
  type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
  };


interface B {
id: number;
name: string;
age: number;
}

type PickB = Pick<B, "id" | "name">;





4、Record
构造一个具有一组重复属性 K(类型 T)的类型。



类型定义

/**
* Construct a type with a set of properties K of type T
  */
  type Record<K extends keyof any, T> = {
  [P in K]: T;
  };


import { IncomingMessage, ServerResponse } from "http";

enum Methods {
GET = "get",
POST = "post",
DELETE = "delete",
PUT = "put",
}

type IRouter = Record<Methods, (req: IncomingMessage, res: ServerResponse) => void>;

// 相当于
{ [T in keyof Methods]: string; }



5、ReturnType
// node_modules/typescript/lib/lib.es5.d.ts

type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;
这个类型也非常好用，可以获取方法的返回类型，可能有些人看到这一长串就被绕晕了，但其实也是使用了 Conditional Types ，推论 ( infer ) 泛型 T 的返回类型 R 来拿到方法的返回类型。

实际使用的话，就可以通过 ReturnType 拿到方法的返回类型，如下的示例

function TestFn() {
return '123123';
}

type T01 = ReturnType<typeof TestFn>; // string


6、Exclude
排除指定范围的类型



类型实现

// node_modules/typescript/lib/lib.es5.d.ts

type Exclude<T, U> = T extends U ? never : T;



这个类型可以将 T 中的某些属于 U 的类型移除掉，举个例子

type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"



Omit<T, K extends keyof any>

从泛型 T 中提取出不在泛型 K 中的属性类型，并组成一个新的对象类型


类型实现

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;



type T00 = Omit<{a:string;b:number;c:string}, "a" | "c" | "f">;  // {b:number}



7、Extract
用于从类型T中取出可分配给U类型的成员，说白了就是取交集。而我们往往将交叉类型理解成交集。这是错误的



type Extract<T, U> = T extends U ? T : never;


8、ThisType
// node_modules/typescript/lib/lib.es5.d.ts

interface ThisType<T> { }
可以看到声明中只有一个接口，没有任何的实现，说明这个类型是在 ts 源码层面支持的，而不是通过类型变换，那这个类型有啥用呢，是用于指定上下文对象类型的。



interface Person {
name: string;
age: number;
}

const obj: ThisType<Person> = {
dosth() {
this.name // string
}
}

// 等同于
const obj = {
dosth(this: Person) {
this.name // string
}
}


9、类型推导
说到类型推导，我们先讲讲extends关键字，extends 运用在 type 和 class 中时完全是两种作用的效果。

在class中用于继承
在type中用于类型判断，一种条件表达式进行类型的关系检测。
type Equal<X, Y> = X extends Y ? true : false;

type Num = Equal<1, 1>; // true
type Str = Equal<'a', 'a'>; // true
type Boo = Equal<true, false>; // false
可以简单理解为一个三元表达。



这里提另外的关键字infer，表示在 extends 条件语句中待推断的类型变量。

type ParamType<T> = T extends (param: infer P) => any ? P : T;
在这个条件语句 T extends (param: infer P) => any ? P : T 中，infer P 表示待推断的函数参数。

整句表示为：如果 T 能赋值给 (param: infer P) => any，则结果是 (param: infer P) => any 类型中的参数 P，否则返回为 T。

type ParamType<T> = T extends (param: infer P) => any ? P : T;

function func1(param:ParamType<{}>){
//   param typeof {}
}

function func2(param:ParamType<(str:string)=>void>){
//   param typeof string
}
ReturnType 就是基于infer实现，infer除了在参数中出现也能在返回值出现。

type ReturnType<T> = T extends (...args: any[]) => infer P ? P : any;


高级用法：

tuple 转 union ，如：[string, number] -> string | number

解答之前，我们需要了解 tuple 类型在一定条件下，是可以赋值给数组类型：

type TTuple = [string, number];
type TArray = Array<string | number>;

type Res = TTuple extends TArray ? true : false;    // true
type ResO = TArray extends TTuple ? true : false;   // false
因此，在配合 infer 时，这很容做到：

type ElementOf<T> = T extends Array<infer E> ? E : never

type TTuple = [string, number];

type ToUnion = ElementOf<ATuple>; // string | number
在 stackoverflow 上看到另一种解法，比较简（牛）单（逼）：

type TTuple = [string, number];
type Res = TTuple[number];  // string | number
type Res = TTuple[0];  // string
type Res = TTuple[1];  // number
type TMap = {a:string;b:number}
type TKeyOf = a | b;
type Res1 = TMap[keyof TMap]; // string | number
typeof a | typeof b // string | number


扩展阅读：
extends
keyof
in
infer
&
|
?
-?
+?
never
unkown
any
readonly
void


练习
interface Logger {
time: number;
asyncLog:(msg: string) => Promise<string>
syncLog:(msg: string) => number;
}

type Translate<T> = /** 你需要实现的部分 **/;

// 要求 Translate
//  1. 提取出为函数类型的属性，丢弃掉其它类型的属性
//  2. 将函数返回类型调整为形参类型(假定有且只有一个参数)

// 实现效果如下:
type T0 = Translate<Logger>;

// 等价于
type T0 = {
// 其它属性被丢弃
asyncLog: (arg: string) => string; // return 类型被调整为跟 arg 保持一致
syncLog: (arg: string) => string; // return 类型被调整为跟 arg 保持一致
}


type NonFunctionKeys<T> = {
[K in keyof T]-?: T[K] extends Function ? never : K;
}[keyof T];

type Translate<T extends object> = {
[K in Exclude<keyof T, NoFunctionKeys1<T>>]: T[K] extends (
arg: infer P,
) => any
? (arg: P) => P
: never;
};




参考资料：
https://github.com/piotrwitek/utility-types

https://www.typescriptlang.org/docs/handbook/2/mapped-types.html

