import { db } from '@/utils/db'
import type { IChapterRecord } from '@/utils/db/record'
import { useEffect, useState } from 'react'

/**
 * 词典统计
 * @param dictID 词典 ID
 * @param isStartLoad 是否开始加载
 * @returns 词典统计
 */
export function useDictStats(dictID: string, isStartLoad: boolean) {
  /**
   * 词典统计
   */
  const [dictStats, setDictStats] = useState<IDictStats | null>(null)

  /**
   * 获取词典统计
   */
  useEffect(() => {
    /**
     * 获取词典统计
     */
    const fetchDictStats = async () => {
      /**
       * 获取词典统计
       */
      const stats = await getDictStats(dictID)
      /**
       * 设置词典统计
       */
      setDictStats(stats)
    }

    /**
     * 如果开始加载，并且词典统计为空，则获取词典统计
     */
    if (isStartLoad && !dictStats) {
      fetchDictStats()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dictID, isStartLoad])

  /**
   * 返回词典统计
   * @returns 词典统计
   */
  return dictStats
}

/**
 * 词典统计
 */
interface IDictStats {
  exercisedChapterCount: number // 已练习章节数
}

/**
 * 获取词典统计
 * @param dict 词典 ID
 * @returns 词典统计
 */
async function getDictStats(dict: string): Promise<IDictStats> {
  /**
   * 获取章节记录
   */
  const records: IChapterRecord[] = await db.chapterRecords.where({ dict }).toArray()
  /**
   * 获取已练习章节数
   */
  const allChapter = records.map(({ chapter }) => chapter).filter((item) => item !== null) as number[]
  /**
   * 获取已练习章节数
   */
  const uniqueChapter = allChapter.filter((value, index, self) => {
    return self.indexOf(value) === index
  })
  /**
   * 获取已练习章节数
   */
  const exercisedChapterCount = uniqueChapter.length

  /**
   * 返回词典统计
   * @returns 词典统计
   */
  return { exercisedChapterCount }
}
