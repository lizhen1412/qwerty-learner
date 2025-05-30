import { toFixedNumber } from '@/utils'
import { db } from '@/utils/db'
import type { IChapterRecord } from '@/utils/db/record'
import { useEffect, useState } from 'react'

/**
 * 章节统计
 * @param chapter 章节
 * @param dictID 词典 ID
 * @param isStartLoad 是否开始加载
 * @returns 章节统计
 */
export function useChapterStats(chapter: number, dictID: string, isStartLoad: boolean) {
  /**
   * 章节统计
   */
  const [chapterStats, setChapterStats] = useState<IChapterStats | null>(null)

  /**
   * 获取章节统计
   */
  useEffect(() => {
    /**
     * 获取章节统计
     */
    const fetchChapterStats = async () => {
      /**
       * 获取章节统计
       */
      const stats = await getChapterStats(dictID, chapter)
      setChapterStats(stats)
    }

    /**
     * 如果开始加载，并且章节统计为空，则获取章节统计
     */
    if (isStartLoad && !chapterStats) {
      fetchChapterStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictID, chapter, isStartLoad])

  /**
   * 返回章节统计
   * @returns 章节统计
   */
  return chapterStats
}

/**
 * 章节统计
 */
interface IChapterStats {
  exerciseCount: number // 练习次数
  avgWrongWordCount: number // 平均错误单词数
  avgWrongInputCount: number // 平均错误输入数
}

/**
 * 获取章节统计
 * @param dict 词典 ID
 * @param chapter 章节
 * @returns 章节统计
 */
async function getChapterStats(dict: string, chapter: number | null): Promise<IChapterStats> {
  /**
   * 获取章节记录
   */
  const records: IChapterRecord[] = await db.chapterRecords.where({ dict, chapter }).toArray()

  /**
   * 获取练习次数
   */
  const exerciseCount = records.length
  /**
   * 获取总错误单词数
   */
  const totalWrongWordCount = records.reduce(
    (total, { wordNumber, correctWordIndexes }) => total + (wordNumber - correctWordIndexes.length),
    0,
  )
  /**
   * 获取平均错误单词数
   */
  const avgWrongWordCount = exerciseCount > 0 ? toFixedNumber(totalWrongWordCount / exerciseCount, 2) : 0
  /**
   * 获取总错误输入数
   */
  const totalWrongInputCount = records.reduce((total, { wrongCount }) => total + (wrongCount ?? 0), 0)
  /**
   * 获取平均错误输入数
   */
  const avgWrongInputCount = exerciseCount > 0 ? toFixedNumber(totalWrongInputCount / exerciseCount, 2) : 0

  /**
   * 返回章节统计
   * @returns 章节统计
   */
  return { exerciseCount, avgWrongWordCount, avgWrongInputCount }
}
