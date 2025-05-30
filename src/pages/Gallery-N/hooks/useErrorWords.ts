import type { Dictionary, Word } from '@/typings'
import { db } from '@/utils/db'
import type { WordRecord } from '@/utils/db/record'
import { wordListFetcher } from '@/utils/wordListFetcher'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

/**
 * 组记录
 */
type groupRecord = {
  word: string // 单词
  records: WordRecord[] // 记录
}

/**
 * 错误单词数据
 */
export type TErrorWordData = {
  word: string // 单词
  originData: Word // 原始数据
  errorCount: number // 错误次数
  errorLetters: Record<string, number> // 错误字母
  errorChar: string[] // 错误字母
  latestErrorTime: number // 最新错误时间
}

/**
 * 错误单词数据
 * @param dict 词典
 * @param reload 是否重新加载
 * @returns 错误单词数据
 */
export default function useErrorWordData(dict: Dictionary, reload: boolean) {
  /**
   * 单词列表
   */
  const { data: wordList, error, isLoading } = useSWR(dict?.url, wordListFetcher)

  /**
   * 错误单词数据
   */
  const [errorWordData, setErrorData] = useState<TErrorWordData[]>([])

  /**
   * 获取错误单词数据
   */
  useEffect(() => {
    /**
     * 如果单词列表为空，则返回
     */
    if (!wordList) return

    /**
     * 获取错误单词数据
     */
    db.wordRecords
      .where('wrongCount') // 错误次数
      .above(0) // 大于0
      .filter((record) => record.dict === dict.id) // 过滤词典
      .toArray()
      .then((records) => {
        /**
         * 组记录
         */
        const groupRecords: groupRecord[] = []

        /**
         * 遍历记录
         */
        records.forEach((record) => {
          /**
           * 获取组记录
           */
          let groupRecord = groupRecords.find((g) => g.word === record.word)
          /**
           * 如果组记录不存在，则创建组记录
           */
          if (!groupRecord) {
            /**
             * 创建组记录
             */
            groupRecord = { word: record.word, records: [] }
            /**
             * 添加组记录
             */
            groupRecords.push(groupRecord)
          }
          /**
           * 添加记录
           */
          groupRecord.records.push(record as WordRecord)
        })

        /**
         * 错误单词数据
         */
        const res: TErrorWordData[] = []

        /**
         * 遍历组记录
         */
        groupRecords.forEach((groupRecord) => {
          /**
           * 错误字母
           */
          const errorLetters = {} as Record<string, number>
          /**
           * 遍历记录
           */
          groupRecord.records.forEach((record) => {
            /**
             * 遍历错误
             */
            for (const index in record.mistakes) {
              /**
               * 获取错误
               */
              const mistakes = record.mistakes[index]
              /**
               * 如果错误不为空，则添加错误
               */
              if (mistakes.length > 0) {
                /**
                 * 添加错误
                 */
                errorLetters[index] = (errorLetters[index] ?? 0) + mistakes.length
              }
            }
          })

          /**
           * 获取单词
           */
          const word = wordList.find((word) => word.name === groupRecord.word)
          /**
           * 如果单词不存在，则返回
           */
          if (!word) return

          /**
           * 错误数据
           */
          const errorData: TErrorWordData = {
            word: groupRecord.word, // 单词
            originData: word, // 原始数据
            errorCount: groupRecord.records.reduce((acc, cur) => {
              /**
               * 累加错误次数
               */
              acc += cur.wrongCount
              /**
               * 返回错误次数
               */
              return acc
            }, 0), // 错误次数
            errorLetters, // 错误字母
            errorChar: Object.entries(errorLetters)
              .sort((a, b) => b[1] - a[1]) // 排序
              .map(([index]) => groupRecord.word[Number(index)]), // 错误字母
            /**
             * 获取最新错误时间
             */
            latestErrorTime: groupRecord.records.reduce((acc, cur) => {
              /**
               * 累加最新错误时间
               */
              acc = Math.max(acc, cur.timeStamp)
              /**
               * 返回最新错误时间
               */
              return acc
            }, 0), // 最新错误时间
          }
          /**
           * 添加错误数据
           */
          res.push(errorData)
        })

        /**
         * 设置错误数据
         */
        setErrorData(res)
      })
  }, [dict.id, wordList, reload])

  /**
   * 返回错误单词数据
   * @returns 错误单词数据
   */
  return { errorWordData, isLoading, error }
}
