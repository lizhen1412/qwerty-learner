import type { WritableAtom } from 'jotai'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { RESET } from 'jotai/vanilla/utils/constants'

/**
 * 带重置功能的SetStateAction类型
 * @template Value 状态值的类型
 */
type SetStateActionWithReset<Value> = Value | typeof RESET | ((prev: Value) => Value | typeof RESET)

/**
 * 创建配置项的原子状态
 * @template T 配置对象的类型，必须为Record<string, unknown>类型
 * @param key 本地存储的键名
 * @param defaultValue 默认配置值
 * @returns 返回一个可写的原子状态，支持重置功能
 *
 * 功能特点：
 * 1. 自动从localStorage中读取初始值
 * 2. 自动处理类型不匹配的情况
 * 3. 自动补全缺失的属性
 * 4. 自动同步更新到localStorage
 * 5. 支持重置功能
 */
export default function atomForConfig<T extends Record<string, unknown>>(
  key: string, // 本地存储的键名
  defaultValue: T, // 默认配置值
): WritableAtom<T, [SetStateActionWithReset<T>], void> {
  // 创建带本地存储支持的原子
  const storageAtom = atomWithStorage(key, defaultValue)

  /**
   * 返回自定义原子，包含读取器和写入器
   * 读取器负责处理配置的完整性和类型安全
   * 写入器直接使用storageAtom的写入功能
   */
  return atom((get) => {
    // Get the underlying object
    const config = get(storageAtom)

    let newConfig: T

    // Check if the types are different
    const isTypeMismatch = typeof config !== typeof defaultValue

    if (isTypeMismatch) {
      newConfig = defaultValue
    } else {
      // Check if there are missing properties
      let hasMissingProperty = false
      for (const key in defaultValue) {
        if (!(key in config)) {
          hasMissingProperty = true
          break
        }
      }

      newConfig = hasMissingProperty ? { ...defaultValue, ...config } : config
    }

    // 如果配置有变化，则更新localStorage
    if (newConfig !== config) {
      // 将配置转换为JSON字符串
      const jsonString = JSON.stringify(newConfig)
      // 更新localStorage
      localStorage.setItem(key, jsonString)
    }

    return newConfig
  }, storageAtom.write)
}
