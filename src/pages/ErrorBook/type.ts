import type { WordRecord } from '@/utils/db/record'

/**
 * 分组单词记录
 */
export type groupedWordRecords = {
  word: string // 单词
  dict: string // 词典
  records: WordRecord[] // 记录
  wrongCount: number // 错误次数
}
