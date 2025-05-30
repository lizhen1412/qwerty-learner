import type { ReviewRecord } from '@/utils/db/record'
import { putWordReviewRecord } from '@/utils/db/review-record'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

/**
 * 复习信息原子数据类型
 */
type TReviewInfoAtomData = {
  isReviewMode: boolean // 是否是复习模式
  reviewRecord: ReviewRecord | undefined // 复习记录
}

/**
 * 复习信息原子工厂函数
 * @param initialValue 初始值
 * @returns 返回一个自定义原子，具有自动同步到IndexedDB的功能
 *
 * 功能特点：
 * 1. 使用atomWithStorage实现本地存储持久化
 * 2. 自动将复习记录同步到IndexedDB
 * 3. 支持直接值更新和函数式更新两种方式
 */
export function reviewInfoAtom(initialValue: TReviewInfoAtomData) {
  // 创建带本地存储支持的原子
  const storageAtom = atomWithStorage('reviewModeInfo', initialValue)

  /**
   * 返回自定义原子，包含读取器和写入器
   * 读取器负责处理配置的完整性和类型安全
   * 写入器直接使用storageAtom的写入功能
   */
  return atom(
    (get) => {
      // 获取配置
      return get(storageAtom)
    },
    (get, set, updater: TReviewInfoAtomData | ((oldValue: TReviewInfoAtomData) => TReviewInfoAtomData)) => {
      const newValue = typeof updater === 'function' ? updater(get(storageAtom)) : updater

      // update reviewRecord to indexdb
      if (newValue.reviewRecord?.id) {
        putWordReviewRecord(newValue.reviewRecord)
      }
      set(storageAtom, newValue)
    },
  )
}
