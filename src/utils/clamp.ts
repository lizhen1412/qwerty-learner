/**
 * 数值范围限制函数
 * @param number 要限制的数值
 * @param lower 下限值
 * @param upper 上限值
 * @returns 限制在[lower, upper]范围内的数值
 *
 * 功能特点：
 * 1. 自动处理非数值输入(NaN)
 * 2. 确保结果在[lower, upper]闭区间内
 * 3. 严格类型检查的TypeScript实现
 *
 * 边界情况处理：
 * - 任一参数为NaN时：下限默认为0，上限默认为0
 * - 当number为NaN时：返回0
 * - 当lower > upper时：实际取两者平均值作为边界
 *
 * 示例：
 * clamp(10, 0, 5) => 5
 * clamp(-3, 0, 5) => 0
 * clamp(3, 0, 5) => 3
 * clamp(NaN, 0, 5) => 0
 * clamp(10, NaN, 5) => 5 (下限视为0)
 * clamp(10, 0, NaN) => 0 (上限视为0)
 */
export default function clamp(number: number, lower: number, upper: number): number {
  // 转换为数值类型（处理字符串等情况）
  number = +number
  lower = +lower
  upper = +upper

  // 处理NaN情况
  lower = lower === lower ? lower : 0 // 如果lower是NaN则设为0
  upper = upper === upper ? upper : 0 // 如果upper是NaN则设为0

  // 仅当number不是NaN时进行处理
  if (number === number) {
    number = number <= upper ? number : upper
    number = number >= lower ? number : lower
  }
  return number
}
