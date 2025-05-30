import type { Dictionary } from '@/typings'

/**
 * 通用分组函数
 * @param elements 要分组的元素数组
 * @param iteratee 生成分组键的回调函数
 * @returns 按分组键组织的对象，键为分组标识，值为该组元素数组
 *
 * 功能特点：
 * 1. 纯函数实现，不修改原数组
 * 2. 支持任意类型元素的分组
 * 3. 使用类型安全的reduce操作
 *
 * 示例：
 * const data = [{type: 'A'}, {type: 'B'}, {type: 'A'}]
 * groupBy(data, item => item.type)
 * // 返回: { A: [{type: 'A'}, {type: 'A'}], B: [{type: 'B'}] }
 */
export default function groupBy<T>(elements: T[], iteratee: (value: T) => string) {
  return elements.reduce<Record<string, T[]>>((result, value) => {
    const key = iteratee(value)
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      result[key].push(value)
    } else {
      result[key] = [value]
    }
    return result
  }, {})
}

/**
 * 按词典标签分组专用函数
 * @param dicts 词典数组
 * @returns 按标签组织的词典对象，键为标签名，值为该标签下的词典数组
 *
 * 功能特点：
 * 1. 处理多标签词典(一个词典可属于多个分组)
 * 2. 空标签安全处理
 * 3. 优化的类型定义
 *
 * 示例：
 * const dicts = [
 *   {name: 'Dict1', tags: ['exam', 'basic']},
 *   {name: 'Dict2', tags: ['basic']}
 * ]
 * groupByDictTags(dicts)
 * // 返回: {
 * //   exam: [{name: 'Dict1', tags: ['exam', 'basic']}],
 * //   basic: [{name: 'Dict1', ...}, {name: 'Dict2', ...}]
 * // }
 */
export function groupByDictTags(dicts: Dictionary[]) {
  // 使用reduce函数对词典数组进行分组
  return dicts.reduce<Record<string, Dictionary[]>>((result, dict) => {
    // 遍历词典的每个标签
    dict.tags.forEach((tag) => {
      // 如果结果对象中已经存在该标签
      if (Object.prototype.hasOwnProperty.call(result, tag)) {
        // 将词典添加到该标签对应的数组中
        result[tag].push(dict)
      } else {
        // 如果结果对象中不存在该标签，则创建一个新的数组并添加词典
        result[tag] = [dict]
      }
    })
    // 返回结果对象
    return result
  }, {})
}
