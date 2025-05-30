import type { WordWithIndex } from '@/typings'
import type { LetterMistakes } from '@/utils/db/record'

export type ChapterData = {
  // warning: 因为有章节内随机的存在，所有记录 index 的场景都应该使用 WordWithIndex.index
  words: WordWithIndex[]
  // chapter index
  index: number
  // 输入的单词数
  wordCount: number
  // 输入正确的单词数
  correctCount: number
  // 输入错误的单词数
  wrongCount: number
  // 每个单词的输入记录
  userInputLogs: UserInputLog[]
  // 本章节用户输入的单词的 record id 列表
  wordRecordIds: number[]
}

/**
 * 用户输入日志
 */
export type UserInputLog = {
  // the index in ChapterData.words, not the index in WordWithIndex
  index: number
  // 正确次数
  correctCount: number
  // 错误次数
  wrongCount: number
  // 字母错误信息
  LetterMistakes: LetterMistakes
}

/**
 * 计时器数据
 */
export type TimerData = {
  time: number // 时间
  accuracy: number // 准确率
  wpm: number // 每分钟单词数
}

/**
 * 错误单词数据
 */
export type WrongWordData = {
  name: string // 单词名称
  wrongCount: number // 错误次数
  wrongLetters: Array<{
    letter: string // 字母
    count: number // 错误次数
  }>
}

/**
 * 打字状态
 */
export type TypingState = {
  chapterData: ChapterData // 章节数据
  timerData: TimerData // 计时器数据
  isTyping: boolean // 是否正在输入
  isFinished: boolean // 是否完成
  isShowSkip: boolean // 是否显示跳过按钮
  isTransVisible: boolean // 是否显示翻译
  isLoopSingleWord: boolean // 是否循环单个单词
  // 是否正在保存数据
  isSavingRecord: boolean
  isWordVisible: boolean // 是否显示单词
}
