
/** 
 * 要求提取ComplexObject中的可选属性
 * let keys: GetOptional<ComplexObject>;
 */
interface ComplexObject {
  mandatory: string;
  option1?: number;
  option2?: number;
}

/**
 * Required<ComplexObject>
 * { mandatory: string; }
 * 获取ComplexObject中的必须属性
 */

/**
 * keyof T
 * 获取T中的属性名
 * P in keyof T
 * 遍历T中的属性名在赋值给P
 * as 给P重命名
 * & 交叉类型得到全量的类型, 如果是具体的类型则取交集类型
 * T[P] 获取T中P属性的类型
 * T[P] extends Required<T>[P] 前者是否在后者中，需要和三元表达式一起使用
 * never 属性类型为never时表示这个属性不存在
 */
type GetOptional<T>  = {
 [P in keyof T as T[P] extends Required<T>[P] ? never : P]: T[P];
}

let keys: GetOptional<ComplexObject>;
// keys { option1?: number, option2?: number;}

/**
 * 将ComplexObject中的一些属性改为可选的属性
 */

interface OrderData {
  id: number;
  orderNo: string;
  policyNo: number;
  amount: number;
}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T,K>>

let option: Optional<OrderData, 'policyNo' | 'amount'>;
// optopn { id: number; orderNo: string; policyNo?: number; amount?: number;}