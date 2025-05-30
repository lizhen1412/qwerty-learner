/**
 * Fisher-Yates 洗牌算法实现
 * 对数组进行随机排序，生成一个新的乱序数组
 *
 * @template T 数组元素类型
 * @param {T[] | null | undefined} array 要洗牌的数组
 * @returns {T[]} 洗牌后的新数组
 *
 * 算法特点:
 * 1. 时间复杂度 O(n) - 高效
 * 2. 空间复杂度 O(n) - 需要复制原数组
 * 3. 每个排列出现的概率均等
 * 4. 不修改原数组(纯函数)
 *
 * 实现步骤:
 * 1. 处理空数组情况
 * 2. 创建数组副本
 * 3. 遍历数组，每个元素与后面随机位置的元素交换
 *
 * 使用示例:
 * const arr = [1, 2, 3, 4, 5];
 * const shuffled = shuffle(arr); // 例如 [3, 1, 5, 2, 4]
 */
export default function shuffle<T>(array: T[]): T[] {
  // 获取数组长度
  const length = array == null ? 0 : array.length
  // 如果数组为空，返回空数组
  if (!length) {
    return []
  }
  let index = -1
  const lastIndex = length - 1
  const result = Array.from(array)

  // Fisher-Yates 洗牌算法核心
  while (++index < length) {
    // 计算随机位置: 从当前元素到末尾中随机选取
    const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))

    // 交换当前元素和随机位置的元素
    const value = result[rand]
    result[rand] = result[index]
    result[index] = value
  }
  return result
}
