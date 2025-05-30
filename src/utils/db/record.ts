import { getUTCUnixTimestamp } from '../index'
import type { Word } from '@/typings'

export interface IWordRecord {
  word: string
  timeStamp: number
  // 正常章节为 dictKey, 其他功能则为对应的类型
  dict: string
  // 用户可能是在 错题/其他类似组件中 进行的练习则为 null, start from 0
  chapter: number | null
  // 正确次数中输入每个字母的时间差，可以据此计算出总时间
  timing: number[]
  // 出错的次数
  wrongCount: number
  // 每个字母被错误输入成什么, index 为字母的索引, 数组内为错误的 e.key
  mistakes: LetterMistakes
}

export interface LetterMistakes {
  // 每个字母被错误输入成什么, index 为字母的索引, 数组内为错误的 e.key
  [index: number]: string[]
}

export class WordRecord implements IWordRecord {
  word: string
  timeStamp: number
  dict: string
  chapter: number | null
  timing: number[]
  wrongCount: number
  mistakes: LetterMistakes

  /**
   * 创建一个新的记录实例
   * @param word 要记录的单词
   * @param dict 字典名称
   * @param chapter 所属章节（可为空）
   * @param timing 输入时间戳数组
   * @param wrongCount 错误次数
   * @param mistakes 错误详情对象
   */
  constructor(word: string, dict: string, chapter: number | null, timing: number[], wrongCount: number, mistakes: LetterMistakes) {
    this.word = word
    this.timeStamp = getUTCUnixTimestamp()
    this.dict = dict
    this.chapter = chapter
    this.timing = timing
    this.wrongCount = wrongCount
    this.mistakes = mistakes
  }

  get totalTime() {
    return this.timing.reduce((acc, curr) => acc + curr, 0)
  }
}

export interface IChapterRecord {
  // 正常章节为 dictKey, 其他功能则为对应的类型
  dict: string
  // 在错题场景中为 -1
  chapter: number | null
  timeStamp: number
  // 单位为 s，章节的记录没必要到毫秒级
  time: number
  // 正确按键次数，输对一个字母即记录
  correctCount: number
  // 错误的按键次数。 出错会清空整个输入，但只记录一次错误
  wrongCount: number
  // 用户输入的单词总数，可能会使用循环等功能使输入总数大于 20
  wordCount: number
  // 一次打对未犯错的单词列表, 可以和 wordNumber 对比得出出错的单词 indexes
  correctWordIndexes: number[]
  // 章节总单词数
  wordNumber: number
  // 单词 record 的 id 列表
  wordRecordIds: number[]
}

export class ChapterRecord implements IChapterRecord {
  // 字典名称
  dict: string
  // 章节编号
  chapter: number | null
  // 时间戳
  timeStamp: number
  // 用时(毫秒)
  time: number
  // 正确计数
  correctCount: number
  // 错误计数
  wrongCount: number
  // 单词总数
  wordCount: number
  // 正确单词索引数组
  correctWordIndexes: number[]
  // 单词编号
  wordNumber: number
  // 单词记录ID数组
  wordRecordIds: number[]

  /**
   * 创建记录实例
   *
   * @param dict 字典名称
   * @param chapter 章节编号（可能为null）
   * @param time 练习总耗时（秒）
   * @param correctCount 正确答题数量
   * @param wrongCount 错误答题数量
   * @param wordCount 总单词数量
   * @param correctWordIndexes 正确单词的索引数组
   * @param wordNumber 当前练习的单词编号
   * @param wordRecordIds 单词记录ID数组
   */
  constructor(
    dict: string,
    chapter: number | null,
    time: number,
    correctCount: number,
    wrongCount: number,
    wordCount: number,
    correctWordIndexes: number[],
    wordNumber: number,
    wordRecordIds: number[],
  ) {
    this.dict = dict
    this.chapter = chapter
    this.timeStamp = getUTCUnixTimestamp()
    this.time = time
    this.correctCount = correctCount
    this.wrongCount = wrongCount
    this.wordCount = wordCount
    this.correctWordIndexes = correctWordIndexes
    this.wordNumber = wordNumber
    this.wordRecordIds = wordRecordIds
  }

  /**
   * 计算并获取每分钟输入的单词数（WPM）
   *
   * @returns 计算后的整数形式的 WPM 值
   */
  get wpm() {
    return Math.round((this.wordCount / this.time) * 60)
  }

  /**
   * 获取用户输入的正确率百分比
   * @returns {number} 正确率百分比（四舍五入取整）
   */
  get inputAccuracy() {
    return Math.round((this.correctCount / this.correctCount + this.wrongCount) * 100)
  }

  get wordAccuracy() {
    return Math.round((this.correctWordIndexes.length / this.wordNumber) * 100)
  }
}

/**
 * 复习记录接口
 */
export interface IReviewRecord {
  /**
   * 记录ID
   */
  id?: number
  /**
   * 字典名称
   */
  dict: string
  /**
   * 当前练习进度
   */
  index: number
  /**
   * 创建时间(时间戳)
   */
  createTime: number
  /**
   * 是否已经完成
   */
  isFinished: boolean
  /**
   * 单词列表
   * 根据复习算法生成和修改，可能会有重复值
   */
  words: Word[]
}

/**
 * 复习记录类，实现IReviewRecord接口
 * 用于跟踪和管理用户的复习进度
 */
export class ReviewRecord implements IReviewRecord {
  /**
   * 记录ID，可选字段
   */
  id?: number
  /**
   * 字典名称
   */
  dict: string
  /**
   * 当前复习进度索引
   */
  index: number
  /**
   * 记录创建时间(UTC时间戳)
   */
  createTime: number
  /**
   * 是否已完成复习
   */
  isFinished: boolean
  /**
   * 需要复习的单词列表
   */
  words: Word[]

  /**
   * 构造函数
   * @param dict 字典名称
   * @param words 单词列表
   */
  constructor(dict: string, words: Word[]) {
    this.dict = dict
    this.index = 0 // 初始化进度索引为0
    this.createTime = getUTCUnixTimestamp() // 设置当前UTC时间戳
    this.words = words
    this.isFinished = false // 初始状态为未完成
  }
}

/**
 * 字典复习记录接口
 * 用于跟踪用户对特定字典的复习进度
 */
export interface IRevisionDictRecord {
  /**
   * 字典名称
   */
  dict: string
  /**
   * 当前复习进度索引
   * 表示用户已经复习到的位置
   */
  revisionIndex: number
  /**
   * 记录创建时间(时间戳)
   * 记录首次创建的时间
   */
  createdTime: number
}

/**
 * 字典复习记录类
 * 实现IRevisionDictRecord接口，用于跟踪特定字典的复习进度
 */
export class RevisionDictRecord implements IRevisionDictRecord {
  /**
   * 字典名称
   */
  dict: string
  /**
   * 当前复习进度索引
   */
  revisionIndex: number
  /**
   * 记录创建时间(时间戳)
   */
  createdTime: number

  /**
   * 构造函数
   * @param dict 字典名称
   * @param revisionIndex 复习进度索引
   * @param createdTime 创建时间(时间戳)
   */
  constructor(dict: string, revisionIndex: number, createdTime: number) {
    this.dict = dict
    this.revisionIndex = revisionIndex
    this.createdTime = createdTime
  }
}

/**
 * 单词复习记录接口
 */
export interface IRevisionWordRecord {
  /**
   * 单词内容
   */
  word: string
  /**
   * 时间戳
   */
  timeStamp: number
  /**
   * 所属字典名称
   */
  dict: string
  /**
   * 错误计数
   */
  errorCount: number
}

/**
 * 单词复习记录类
 * 实现IRevisionWordRecord接口，用于跟踪单个单词的复习情况
 */
export class RevisionWordRecord implements IRevisionWordRecord {
  /**
   * 单词内容
   */
  word: string
  /**
   * 记录时间戳
   */
  timeStamp: number
  /**
   * 所属字典名称
   */
  dict: string
  /**
   * 错误计数
   */
  errorCount: number

  /**
   * 构造函数
   * @param word 单词内容
   * @param dict 所属字典名称
   * @param errorCount 错误计数
   */
  constructor(word: string, dict: string, errorCount: number) {
    this.word = word
    this.timeStamp = getUTCUnixTimestamp() // 使用当前UTC时间戳
    this.dict = dict
    this.errorCount = errorCount
  }
}
