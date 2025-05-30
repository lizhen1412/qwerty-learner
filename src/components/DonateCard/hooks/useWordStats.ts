import { db } from '@/utils/db'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

/**
 * 获取章节数量
 * @returns 章节数量
 */
export function useChapterNumber() {
  // 使用useState定义一个状态变量chapterNumber，初始值为0
  const [chapterNumber, setChapterNumber] = useState<number>(0)

  // 使用useEffect在组件挂载时获取章节数量
  useEffect(() => {
    // 定义一个异步函数获取章节数量
    const fetchChapterNumber = async () => {
      // 从数据库chapterRecords表中获取记录总数
      const number = await db.chapterRecords.count()
      // 更新章节数量状态
      setChapterNumber(number)
    }

    // 调用获取章节数量的函数
    fetchChapterNumber()
  }, []) // 空依赖数组表示只在组件挂载时执行一次

  // 返回当前章节数量
  return chapterNumber
}

/**
 * 获取距离第一个单词记录的天数
 * @returns 距离第一个单词记录的天数
 */
export function useDayFromFirstWordRecord() {
  // 使用useState定义一个状态变量dayFromFirstWordRecord，初始值为0
  const [dayFromFirstWordRecord, setDayFromFirstWordRecord] = useState<number>(0)

  // 使用useEffect在组件挂载时计算距离第一个单词记录的天数
  useEffect(() => {
    // 定义一个异步函数获取距离第一个单词记录的天数
    const fetchDayFromFirstWordRecord = async () => {
      // 从数据库wordRecords表中获取时间戳最早的记录
      const firstWordRecord = await db.wordRecords.orderBy('timeStamp').first()
      // 获取第一个单词记录的时间戳，如果没有记录则默认为0
      const firstWordRecordTimeStamp = firstWordRecord?.timeStamp || 0
      // 获取当前时间
      const now = dayjs()
      // 将时间戳转换为dayjs对象
      const timestamp = dayjs.unix(firstWordRecordTimeStamp)
      // 计算当前时间与第一个记录时间之间的天数差
      const daysPassed = now.diff(timestamp, 'day')
      // 更新状态
      setDayFromFirstWordRecord(daysPassed)
    }

    // 调用计算天数的函数
    fetchDayFromFirstWordRecord()
  }, []) // 空依赖数组表示只在组件挂载时执行一次

  // 返回距离第一个单词记录的天数
  return dayFromFirstWordRecord
}

/**
 * 获取单词数量
 * @returns 单词数量
 */
export function useWordNumber() {
  // 使用useState定义一个状态变量wordNumber，初始值为0
  const [wordNumber, setWordNumber] = useState<number>(0)

  // 使用useEffect在组件挂载时获取单词数量
  useEffect(() => {
    // 定义一个异步函数获取单词数量
    const fetchWordNumber = async () => {
      // 从数据库wordRecords表中获取记录总数
      const number = await db.wordRecords.count()
      // 更新单词数量状态
      setWordNumber(number)
    }

    // 调用获取单词数量的函数
    fetchWordNumber()
  }, []) // 空依赖数组表示只在组件挂载时执行一次

  // 返回当前单词数量
  return wordNumber
}

/**
 * 获取总错误次数
 * @returns 总错误次数
 */
export function useSumWrongCount() {
  const [sumWrongCount, setSumWrongCount] = useState<number>(0)

  // 使用useEffect在组件挂载时获取总错误次数
  useEffect(() => {
    // 定义一个异步函数获取总错误次数
    const fetchSumWrongCount = async () => {
      // 初始化总错误次数为0
      let totalWrongCount = 0

      // 遍历数据库chapterRecords表中的所有记录
      await db.chapterRecords.each((record) => {
        // 将每条记录的wrongCount累加到totalWrongCount中
        totalWrongCount += record.wrongCount || 0
      })
      // 更新总错误次数状态
      setSumWrongCount(totalWrongCount)
    }

    // 调用获取总错误次数的函数
    fetchSumWrongCount()
  }, [])

  // 返回总错误次数
  return sumWrongCount
}
