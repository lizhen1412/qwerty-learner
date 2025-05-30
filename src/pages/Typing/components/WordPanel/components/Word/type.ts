import type { LetterState } from './Letter'
import type { LetterMistakes } from '@/utils/db/record'

/**
 * 单词状态类型定义
 * 用于跟踪和记录用户输入单词时的各种状态信息
 */
export type WordState = {
  displayWord: string // 显示给用户的单词（可能包含隐藏字母等处理后的形式）
  inputWord: string // 用户实际输入的单词内容
  letterStates: LetterState[] // 每个字母的状态数组（如正确、错误、未输入等）
  isFinished: boolean // 标记该单词是否已完成输入
  // 是否出现输入错误
  hasWrong: boolean
  // 记录是否已经出现过输入错误
  hasMadeInputWrong: boolean
  // 用户输入错误的次数
  wrongCount: number
  startTime: string // 单词开始输入的时间戳
  endTime: string // 单词完成输入的时间戳
  inputCount: number // 用户总输入次数（包括正确和错误的输入）
  correctCount: number // 用户正确输入的次数统计
  letterTimeArray: number[] // 记录每个字母的输入时间（用于分析输入速度等）
  letterMistake: LetterMistakes // 记录每个字母的错误情况（具体错误类型等详细信息）
  // 用于随机隐藏字母功能
  // true表示可见，false表示隐藏
  randomLetterVisible: boolean[]
}

/**
 * 单词状态的初始值
 * 提供一个默认的WordState对象，所有属性都初始化为空或false
 */
export const initialWordState: WordState = {
  displayWord: '', // 空显示内容
  inputWord: '', // 空输入内容
  letterStates: [], // 空字母状态数组
  isFinished: false, // 未完成
  hasWrong: false, // 无错误
  hasMadeInputWrong: false, // 未输入错误
  wrongCount: 0, // 错误次数
  startTime: '', // 开始时间
  endTime: '', // 结束时间
  inputCount: 0, // 输入次数
  correctCount: 0, // 正确次数
  letterTimeArray: [], // 字母输入时间数组
  letterMistake: {}, // 字母错误信息
  randomLetterVisible: [], // 随机字母可见性数组
}
