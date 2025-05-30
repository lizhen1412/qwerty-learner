import { db } from '@/utils/db'
import { useEffect, useState } from 'react'

/**
 * 复习单词数量
 * @param dictID 词典 ID
 * @returns 复习单词数量
 */
export function useRevisionWordCount(dictID: string) {
  /**
   * 复习单词数量
   */
  const [wordCount, setWordCount] = useState<number>(0)

  /**
   * 获取复习单词数量
   */
  useEffect(() => {
    /**
     * 获取复习单词数量
     */
    const fetchWordCount = async () => {
      /**
       * 获取复习单词数量
       */
      const count = await getRevisionWordCount(dictID)
      /**
       * 设置复习单词数量
       */
      setWordCount(count)
    }

    /**
     * 如果词典 ID 存在，则获取复习单词数量
     */
    if (dictID) {
      /**
       * 获取复习单词数量
       */
      fetchWordCount()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictID])

  /**
   * 返回复习单词数量
   * @returns 复习单词数量
   */
  return wordCount
}

/**
 * 获取复习单词数量
 * @param dict 词典 ID
 * @returns 复习单词数量
 */
async function getRevisionWordCount(dict: string): Promise<number> {
  /**
   * 获取复习单词数量
   */
  const wordCount = await db.wordRecords
    .where('dict') // 词典 ID
    .equals(dict) // 等于
    .and((wordRecord) => wordRecord.wrongCount > 0) // 错误次数大于0
    .toArray() // 获取记录
    .then((wordRecords) => {
      /**
       * 创建映射
       */
      const res = new Map()
      /**
       * 过滤记录
       */
      const reducedRecords = wordRecords.filter((item) => !res.has(item['word'] + item['dict']) && res.set(item['word'] + item['dict'], 1))
      /**
       * 返回复习单词数量
       */
      return reducedRecords.length
    })

  /**
   * 返回复习单词数量
   * @returns 复习单词数量
   */
  return wordCount
}
