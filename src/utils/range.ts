// 定义无限大的数值表示
const INFINITY = 1 / 0
// 定义JavaScript能表示的最大数值(Number.MAX_VALUE)
const MAX_INTEGER = 1.7976931348623157e308

/**
 * 将数值转换为有限数值
 * @param value 要转换的数值
 * @returns 转换后的有限数值
 *
 * 处理规则:
 * 1. 如果是正/负无穷大，转换为最大/最小有限数
 * 2. 如果是NaN，转换为0
 * 3. 其他情况返回原值
 */
function toFinite(value: number): number {
  // 处理无穷大情况
  if (value === INFINITY || value === -INFINITY) {
    const sign = value < 0 ? -1 : 1 // 保留符号
    return sign * MAX_INTEGER // 转换为最大有限数
  }
  // 处理NaN情况(value !== value 是判断NaN的可靠方法)
  return value === value ? value : 0
}

/**
 * 基础范围生成函数(内部使用)
 * @param start 范围起始值
 * @param end 范围结束值
 * @param step 步长
 * @returns 生成的范围数组
 */
function baseRange(start: number, end: number, step: number): number[] {
  // 初始化索引和长度
  let index = -1
  let length = Math.max(Math.ceil((end - start) / (step || 1)), 0)
  // 创建结果数组
  const result = new Array<number>(length)

  // 循环生成范围数组
  while (length--) {
    result[++index] = start // 将当前值添加到结果数组
    start += step // 更新起始值
  }
  // 返回生成的范围数组
  return result
}

/**
 * 范围生成函数
 * @param start 范围起始值
 * @param end 范围结束值(可选)
 * @param step 步长(可选)
 * @returns 生成的范围数组
 *
 * 使用示例:
 * range(5) => [0, 1, 2, 3, 4]
 * range(1, 5) => [1, 2, 3, 4]
 * range(0, 10, 2) => [0, 2, 4, 6, 8]
 * range(5, 0, -1) => [5, 4, 3, 2, 1]
 */
export default function range(start: number, end: number, step: number): number[] {
  // Ensure the sign of `-0` is preserved.
  // 处理-0的情况(保留符号)
  start = toFinite(start)

  // 处理end未提供的情况(生成0到start-1的序列)
  if (end === undefined) {
    end = start
    start = 0
  } else {
    end = toFinite(end)
  }

  // 设置默认步长(根据start和end的大小决定递增或递减)
  step = step === undefined ? (start < end ? 1 : -1) : toFinite(step)

  // 调用基础范围生成函数
  return baseRange(start, end, step)
}
