import { currentDictIdAtom } from '@/store'
import { db } from '@/utils/db'
import type { IChapterRecord } from '@/utils/db/record'
import { useAtomValue } from 'jotai'
import { useEffect, useState } from 'react'

/**
 * 使用章节统计
 * @param chapter 章节
 * @param isStartLoad 是否开始加载
 * @returns 章节统计
 */
export function useChapterStats(chapter: number, isStartLoad: boolean) {
  /**
   * 词典 ID
   */
  const dictID = useAtomValue(currentDictIdAtom)
  /**
   * 章节统计
   */
  const [chapterStats, setChapterStats] = useState<IChapterStats | null>(null)

  /**
   * 使用 useEffect 监听词典 ID 和章节
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
      /**
       * 设置章节统计
       */
      setChapterStats(stats)
    }

    /**
     * 如果开始加载且章节统计为空，则获取章节统计
     */
    if (isStartLoad && !chapterStats) {
      /**
       * 获取章节统计
       */
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
  avgWrongCount: number // 平均错误次数
}

/**
 * 获取章节统计
 * @param dict 词典
 * @param chapter 章节
 * @returns 章节统计
 */
async function getChapterStats(dict: string, chapter: number | null): Promise<IChapterStats> {
  /**
   * 获取章节记录
   */
  const records: IChapterRecord[] = await db.chapterRecords.where({ dict, chapter }).toArray()

  /**
   * 计算练习次数
   */
  const exerciseCount = records.length
  /**
   * 计算平均错误次数
   */
  const totalWrongCount = records.reduce((total, { wrongCount }) => total + (wrongCount || 0), 0)
  /**
   * 计算平均错误次数
   */
  const avgWrongCount = exerciseCount > 0 ? totalWrongCount / exerciseCount : 0

  /**
   * 返回章节统计
   * @returns 章节统计
   */
  return { exerciseCount, avgWrongCount }
}
