import { db } from '.'
import { ReviewRecord } from './record'
import type { TErrorWordData } from '@/pages/Gallery-N/hooks/useErrorWords'
import type { Word } from '@/typings'
import { useEffect, useState } from 'react'

/**
 * 自定义Hook：获取最新的复习记录
 * @param dictID 词典ID
 * @returns 最新的未完成复习记录
 */
export function useGetLatestReviewRecord(dictID: string) {
  // 创建状态来存储最新的复习记录
  const [wordReviewRecord, setWordReviewRecord] = useState<ReviewRecord | undefined>(undefined)

  // 使用useEffect来获取最新的复习记录
  useEffect(() => {
    const fetchWordReviewRecords = async () => {
      // 获取最新的复习记录
      const record = await getReviewRecords(dictID)
      // 更新状态
      setWordReviewRecord(record)
    }
    // 如果词典ID存在，则获取最新的复习记录
    if (dictID) {
      // 获取最新的复习记录
      fetchWordReviewRecords()
    }
  }, [dictID])

  // 返回最新的复习记录
  return wordReviewRecord
}

/**
 * 获取指定词典的复习记录
 * @param dictID 词典ID
 * @returns 最新的未完成复习记录，如果没有则返回undefined
 */
async function getReviewRecords(dictID: string): Promise<ReviewRecord | undefined> {
  // 获取指定词典的复习记录
  const records = await db.reviewRecords.where('dict').equals(dictID).toArray()
  // 获取最新的复习记录
  const latestRecord = records.sort((a, b) => a.createTime - b.createTime).pop()
  // 如果最新的复习记录存在且未完成，则返回最新的复习记录，否则返回undefined
  return latestRecord && (latestRecord.isFinished ? undefined : latestRecord)
}

/**
 * 带排名的错误单词数据类型
 */
type TRankedErrorWordData = TErrorWordData & {
  errorCountScore: number // 错误次数排名得分
  latestErrorTimeScore: number // 最近错误时间排名得分
}

/**
 * 生成新的单词复习记录
 * @param dictID 词典ID
 * @param errorData 错误单词数据数组
 * @returns 新创建的复习记录
 */
export async function generateNewWordReviewRecord(dictID: string, errorData: TErrorWordData[]) {
  // 计算错误次数排名
  const errorCountRankings = [...errorData].sort((a, b) => a.errorCount - b.errorCount)
  // 计算最近错误时间排名
  const latestErrorTimeRankings = [...errorData].sort((a, b) => a.latestErrorTime - b.latestErrorTime)

  // 计算每个对象的排名得分
  const errorDataWithRank: TRankedErrorWordData[] = errorData.map((item) => ({
    ...item,
    errorCountScore: errorCountRankings.indexOf(item) + 1, // 错误次数排名(1-based)
    latestErrorTimeScore: latestErrorTimeRankings.indexOf(item) + 1, // 最近错误时间排名(1-based)
  }))

  // 根据加权排名进行排序
  const errorCountWeight = 0.6 // 错误次数权重
  const latestErrorTimeWeight = 0.4 // 最近错误时间权重

  // 根据加权排名进行排序
  const sortedWords: Word[] = errorDataWithRank
    .sort((a, b) => {
      // 计算 a 和 b 的得分
      const scoreA = a.errorCountScore * errorCountWeight + a.latestErrorTimeScore * latestErrorTimeWeight
      const scoreB = b.errorCountScore * errorCountWeight + b.latestErrorTimeScore * latestErrorTimeWeight

      // 根据得分进行排序
      return scoreA - scoreB
    })
    .map((item) => item.originData)

  // 创建新的复习记录
  const record = new ReviewRecord(dictID, sortedWords)
  // 保存新的复习记录
  await db.reviewRecords.put(record)
  // 返回新的复习记录
  return record
}

/**
 * 更新单词复习记录
 * @param record 要更新的复习记录
 */
export async function putWordReviewRecord(record: ReviewRecord) {
  db.reviewRecords.put(record)
}
