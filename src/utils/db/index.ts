import type { IChapterRecord, IReviewRecord, IRevisionDictRecord, IWordRecord, LetterMistakes } from './record'
import { ChapterRecord, ReviewRecord, WordRecord } from './record'
import { TypingContext, TypingStateActionType } from '@/pages/Typing/store'
import type { TypingState } from '@/pages/Typing/store/type'
import { currentChapterAtom, currentDictIdAtom, isReviewModeAtom } from '@/store'
import type { Table } from 'dexie'
import Dexie from 'dexie'
import { useAtomValue } from 'jotai'
import { useCallback, useContext } from 'react'

/**
 * 记录数据库类
 * 继承自Dexie，定义应用的数据表结构
 */
class RecordDB extends Dexie {
  // 单词记录表
  wordRecords!: Table<IWordRecord, number>

  // 章节记录表
  chapterRecords!: Table<IChapterRecord, number>

  // 复习记录表
  reviewRecords!: Table<IReviewRecord, number>

  // 复习词典记录表
  revisionDictRecords!: Table<IRevisionDictRecord, number>

  // 复习单词记录表
  revisionWordRecords!: Table<IWordRecord, number>

  /**
   * 构造函数
   * 初始化数据库实例
   */
  constructor() {
    super('RecordDB') // 数据库名称
    // 版本1的数据库模式
    this.version(1).stores({
      wordRecords: '++id,word,timeStamp,dict,chapter,errorCount,[dict+chapter]',
      chapterRecords: '++id,timeStamp,dict,chapter,time,[dict+chapter]',
    })

    // 版本2的数据库模式（将errorCount重命名为wrongCount）
    this.version(2).stores({
      wordRecords: '++id,word,timeStamp,dict,chapter,wrongCount,[dict+chapter]',
      chapterRecords: '++id,timeStamp,dict,chapter,time,[dict+chapter]',
    })

    // 版本3的数据库模式（添加复习记录表）
    this.version(3).stores({
      wordRecords: '++id,word,timeStamp,dict,chapter,wrongCount,[dict+chapter]',
      chapterRecords: '++id,timeStamp,dict,chapter,time,[dict+chapter]',
      reviewRecords: '++id,dict,createTime,isFinished',
    })
  }
}

// 创建数据库实例
export const db = new RecordDB()

// 将表映射到对应的类
db.wordRecords.mapToClass(WordRecord)
db.chapterRecords.mapToClass(ChapterRecord)
db.reviewRecords.mapToClass(ReviewRecord)

/**
 * 自定义Hook：保存章节记录
 * @returns 保存章节记录的函数
 */
export function useSaveChapterRecord() {
  // 获取当前章节
  const currentChapter = useAtomValue(currentChapterAtom)
  // 获取是否复习模式
  const isRevision = useAtomValue(isReviewModeAtom)
  // 获取当前词典ID
  const dictID = useAtomValue(currentDictIdAtom)

  // 创建保存章节记录的回调函数
  const saveChapterRecord = useCallback(
    (typingState: TypingState) => {
      const {
        chapterData: { correctCount, wrongCount, userInputLogs, wordCount, words, wordRecordIds },
        timerData: { time },
      } = typingState
      const correctWordIndexes = userInputLogs.filter((log) => log.correctCount > 0 && log.wrongCount === 0).map((log) => log.index)

      // 创建章节记录实例
      const chapterRecord = new ChapterRecord(
        dictID, // 词典ID
        isRevision ? -1 : currentChapter, // 复习模式使用-1作为章节标识
        time, // 章节用时
        correctCount, // 正确单词数
        wrongCount, // 错误单词数
        wordCount, // 总单词数
        correctWordIndexes, // 正确单词索引
        words.length, // 单词总数
        wordRecordIds ?? [], // 单词记录ID
      )
      // 保存章节记录
      db.chapterRecords.add(chapterRecord)
    },
    [currentChapter, dictID, isRevision],
  )

  return saveChapterRecord
}

/**
 * 单词按键记录器类型
 * 用于记录单词按键的时间戳和错误类型
 */
export type WordKeyLogger = {
  letterTimeArray: number[] // 字母按键时间戳数组
  letterMistake: LetterMistakes // 字母错误类型
}

/**
 * 自定义Hook：保存单词记录
 * @returns 保存单词记录的函数
 */
export function useSaveWordRecord() {
  // 获取是否复习模式
  const isRevision = useAtomValue(isReviewModeAtom)
  // 获取当前章节
  const currentChapter = useAtomValue(currentChapterAtom)
  // 获取当前词典ID
  const dictID = useAtomValue(currentDictIdAtom)

  // 获取dispatch函数
  const { dispatch } = useContext(TypingContext) ?? {}

  // 创建保存单词记录的回调函数
  const saveWordRecord = useCallback(
    async ({
      word,
      wrongCount,
      letterTimeArray,
      letterMistake,
    }: {
      word: string // 单词
      wrongCount: number // 错误次数
      letterTimeArray: number[] // 字母按键时间戳数组
      letterMistake: LetterMistakes // 字母错误类型
    }) => {
      // 计算字母输入间隔时间
      const timing = []
      for (let i = 1; i < letterTimeArray.length; i++) {
        const diff = letterTimeArray[i] - letterTimeArray[i - 1]
        timing.push(diff)
      }

      // 创建单词记录实例
      const wordRecord = new WordRecord(word, dictID, isRevision ? -1 : currentChapter, timing, wrongCount, letterMistake)

      let dbID = -1
      try {
        dbID = await db.wordRecords.add(wordRecord)
      } catch (e) {
        console.error(e)
      }
      if (dispatch) {
        dbID > 0 && dispatch({ type: TypingStateActionType.ADD_WORD_RECORD_ID, payload: dbID })
        dispatch({ type: TypingStateActionType.SET_IS_SAVING_RECORD, payload: false })
      }
    },
    [currentChapter, dictID, dispatch, isRevision],
  )

  return saveWordRecord
}

/**
 * 自定义Hook：删除单词记录
 * @returns 删除单词记录的函数
 */
export function useDeleteWordRecord() {
  // 创建删除单词记录的回调函数
  const deleteWordRecord = useCallback(async (word: string, dict: string) => {
    try {
      const deletedCount = await db.wordRecords.where({ word, dict }).delete() // 删除单词记录
      return deletedCount
    } catch (error) {
      console.error(`删除单词记录时出错：`, error)
    }
  }, [])

  return { deleteWordRecord }
}
