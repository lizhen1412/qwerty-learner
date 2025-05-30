import { db } from '@/utils/db'
import type { IWordRecord } from '@/utils/db/record'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import type { Activity } from 'react-activity-calendar'

/**
 * 单词统计
 */
interface IWordStats {
  isEmpty?: boolean // 是否为空
  exerciseRecord: Activity[] // 练习记录
  wordRecord: Activity[] // 单词记录
  wpmRecord: [string, number][] // wpm记录
  accuracyRecord: [string, number][] // 正确率记录
  wrongTimeRecord: { name: string; value: number }[] // 错误时间记录
}

/**
 * 获取两个日期之间的所有日期，使用dayjs计算
 * @param start 开始日期
 * @param end 结束日期
 * @returns 日期数组
 */
function getDatesBetween(start: number, end: number) {
  const dates = [] // 日期数组
  let curr = dayjs(start).startOf('day') // 当前日期
  const last = dayjs(end).endOf('day')

  while (curr.diff(last) < 0) {
    // 当前日期小于结束日期
    dates.push(curr.clone().format('YYYY-MM-DD')) // 添加日期
    curr = curr.add(1, 'day') // 增加一天
  }

  return dates
}

/**
 * 获取等级
 * @param value 值
 * @returns 等级
 */
function getLevel(value: number) {
  // 如果值为0，返回0
  if (value === 0) return 0
  // 如果值小于4，返回1
  else if (value < 4) return 1
  // 如果值小于8，返回2
  else if (value < 8) return 2
  // 如果值小于12，返回3
  else if (value < 12) return 3
  // 否则返回4
  else return 4
}

/**
 * 使用单词统计
 * @param startTimeStamp 开始时间戳
 * @param endTimeStamp 结束时间戳
 * @returns 单词统计
 */
export function useWordStats(startTimeStamp: number, endTimeStamp: number) {
  const [wordStats, setWordStats] = useState<IWordStats>({
    exerciseRecord: [],
    wordRecord: [],
    wpmRecord: [],
    accuracyRecord: [],
    wrongTimeRecord: [],
  })

  /**
   * 使用 useEffect 监听数据变化
   */
  useEffect(() => {
    /**
     * 获取单词统计
     */
    const fetchWordStats = async () => {
      /**
       * 获取单词统计
       */
      const stats = await getChapterStats(startTimeStamp, endTimeStamp)

      /**
       * 设置单词统计
       */
      setWordStats(stats)
    }

    fetchWordStats()
  }, [startTimeStamp, endTimeStamp])

  /**
   * 返回单词统计
   * @returns 单词统计
   */
  return wordStats
}

/**
 * 获取章节统计
 * @param startTimeStamp 开始时间戳
 * @param endTimeStamp 结束时间戳
 * @returns 章节统计
 */
async function getChapterStats(startTimeStamp: number, endTimeStamp: number): Promise<IWordStats> {
  // indexedDB查找某个数字范围内的数据
  const records: IWordRecord[] = await db.wordRecords.where('timeStamp').between(startTimeStamp, endTimeStamp).toArray()

  /**
   * 如果记录为空，返回空对象
   */
  if (records.length === 0) {
    return { isEmpty: true, exerciseRecord: [], wordRecord: [], wpmRecord: [], accuracyRecord: [], wrongTimeRecord: [] }
  }

  /**
   * 数据
   */
  let data: {
    [x: string]: {
      exerciseTime: number //练习次数
      words: string[] //练习词数组（不去重）
      totalTime: number //总计用时
      wrongCount: number //错误次数
      wrongKeys: string[] //按错的按键
    }
  } = {}

  /**
   * 获取日期
   */
  const dates = getDatesBetween(startTimeStamp * 1000, endTimeStamp * 1000)

  /**
   * 设置数据
   */
  data = dates
    .map((date) => ({ [date]: { exerciseTime: 0, words: [], totalTime: 0, wrongCount: 0, wrongKeys: [] } }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {})

  /**
   * 设置数据
   */
  for (let i = 0; i < records.length; i++) {
    /**
     * 获取日期
     */
    const date = dayjs(records[i].timeStamp * 1000).format('YYYY-MM-DD')

    /**
     * 设置数据 (练习时间)
     */
    data[date].exerciseTime = data[date].exerciseTime + 1
    /**
     * 设置数据 (练习词数)
     */
    data[date].words = [...data[date].words, records[i].word]
    /**
     * 设置数据 (总计用时)
     */
    data[date].totalTime = data[date].totalTime + records[i].timing.reduce((acc, curr) => acc + curr, 0)
    /**
     * 设置数据 (错误次数)
     */
    data[date].wrongCount = data[date].wrongCount + records[i].wrongCount
    /**
     * 设置数据 (错误按键)
     */
    data[date].wrongKeys = [...(data[date].wrongKeys || []), ...(Object.values(records[i].mistakes).flat() || [])]
  }

  /**
   * 记录数组
   */
  const RecordArray = Object.entries(data)

  /**
   * 练习次数统计
   */
  const exerciseRecord: IWordStats['exerciseRecord'] = RecordArray.map(([date, { exerciseTime }]) => ({
    date, // 日期
    count: exerciseTime, // 练习次数
    level: getLevel(exerciseTime),
  }))
  /**
   * 练习词数统计（去重）
   */
  const wordRecord: IWordStats['wordRecord'] = RecordArray.map(([date, { words }]) => ({
    date, // 日期
    count: Array.from(new Set(words)).length, // 练习词数
    level: getLevel(Array.from(new Set(words)).length),
  }))
  /**
   * wpm=练习词数（不去重）/总时间
   */
  const wpmRecord: IWordStats['wpmRecord'] = RecordArray.map<[string, number]>(([date, { words, totalTime }]) => [
    date, // 日期
    Math.round(words.length / (totalTime / 1000 / 60)),
  ]).filter((d) => d[1])
  /**
   * 正确率=每个单词的长度合计/(每个单词的长度合计+总错误次数)
   */
  const accuracyRecord: IWordStats['accuracyRecord'] = RecordArray.map<[string, number]>(([date, { words, wrongCount }]) => [
    date, // 日期
    Math.round((words.join('').length / (words.join('').length + wrongCount)) * 100),
  ]).filter((d) => d[1])
  /**
   * 错误次数统计
   */
  const wrongTimeRecord: IWordStats['wrongTimeRecord'] = []
  /**
   * 错误时间记录
   */
  const allWrongTime = RecordArray.map(([, { wrongKeys }]) => wrongKeys)
    .flat()
    .map((key) => key.toUpperCase())
  /**
   * 错误时间记录
   */
  allWrongTime.forEach((key) => {
    /**
     * 获取错误时间记录
     */
    const index = wrongTimeRecord.findIndex((item) => item.name === key)
    // 如果错误时间记录不存在，则添加错误时间记录
    if (index === -1) {
      // 添加错误时间记录
      wrongTimeRecord.push({ name: key, value: 1 })
    } else {
      // 增加错误时间记录
      wrongTimeRecord[index].value++
    }
  })

  return { exerciseRecord, wordRecord, wpmRecord, accuracyRecord, wrongTimeRecord }
}
