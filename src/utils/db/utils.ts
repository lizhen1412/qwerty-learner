import type { LetterMistakes } from './record'

/**
 * 合并两个字母错误记录对象
 * @param letterMistake1 第一个字母错误记录
 * @param letterMistake2 第二个字母错误记录
 * @returns 合并后的新字母错误记录对象
 *
 * 功能说明：
 * 1. 将两个字母错误记录合并为一个新对象
 * 2. 对于相同的字母键，合并其错误数组
 * 3. 不会修改原始对象，返回全新对象
 *
 * 示例：
 * const mistakes1 = { a: [1, 2], b: [3] }
 * const mistakes2 = { a: [4], c: [5] }
 * mergeLetterMistake(mistakes1, mistakes2)
 * // 返回: { a: [1, 2, 4], b: [3], c: [5] }
 */
export function mergeLetterMistake(letterMistake1: LetterMistakes, letterMistake2: LetterMistakes): LetterMistakes {
  // 创建一个空对象来存储合并后的结果
  const result: LetterMistakes = {}

  // 遍历两个字母错误记录对象
  for (const mistakes of [letterMistake1, letterMistake2]) {
    for (const key in mistakes) {
      // 如果结果对象中已经存在该字母键
      if (result[key]) {
        // 将当前对象中的错误数组合并到结果对象中
        result[key].push(...mistakes[key])
      } else {
        // 如果结果对象中不存在该字母键，则创建一个新的错误数组
        result[key] = [...mistakes[key]]
      }
    }
  }

  return result
}
