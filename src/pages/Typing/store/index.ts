import type { TypingState, UserInputLog } from './type'
import type { WordWithIndex } from '@/typings'
import type { LetterMistakes } from '@/utils/db/record'
import '@/utils/db/review-record'
import { mergeLetterMistake } from '@/utils/db/utils'
import shuffle from '@/utils/shuffle'
import { createContext } from 'react'

/**
 * 初始状态
 */
export const initialState: TypingState = {
  chapterData: {
    words: [], // 单词列表
    index: 0, // 当前单词索引
    wordCount: 0, // 单词数量
    correctCount: 0, // 正确次数
    wrongCount: 0, // 错误次数
    wordRecordIds: [], // 单词记录ID列表
    userInputLogs: [], // 用户输入日志列表
  },
  timerData: {
    time: 0, // 时间
    accuracy: 0, // 准确率
    wpm: 0, // 每分钟单词数
  },
  isTyping: false, // 是否正在输入
  isFinished: false, // 是否完成
  isShowSkip: false, // 是否显示跳过按钮
  isTransVisible: true, // 是否显示翻译
  isLoopSingleWord: false, // 是否循环单个单词
  isSavingRecord: false, // 是否正在保存记录
}

/**
 * 初始用户输入日志
 */
export const initialUserInputLog: UserInputLog = {
  index: 0, // 单词索引
  correctCount: 0, // 正确次数
  wrongCount: 0, // 错误次数
  LetterMistakes: {}, // 字母错误信息
}

/**
 * 状态动作类型
 */
export enum TypingStateActionType {
  SETUP_CHAPTER = 'SETUP_CHAPTER', // 设置章节
  SET_IS_SKIP = 'SET_IS_SKIP', // 设置是否显示跳过按钮
  SET_IS_TYPING = 'SET_IS_TYPING', // 设置是否正在输入
  TOGGLE_IS_TYPING = 'TOGGLE_IS_TYPING', // 切换是否正在输入
  REPORT_WRONG_WORD = 'REPORT_WRONG_WORD', // 报告错误单词
  REPORT_CORRECT_WORD = 'REPORT_CORRECT_WORD', // 报告正确单词
  NEXT_WORD = 'NEXT_WORD', // 下一个单词
  LOOP_CURRENT_WORD = 'LOOP_CURRENT_WORD', // 循环当前单词
  FINISH_CHAPTER = 'FINISH_CHAPTER', // 完成章节
  INCREASE_WRONG_WORD = 'INCREASE_WRONG_WORD', // 增加错误单词
  SKIP_WORD = 'SKIP_WORD', // 跳过单词
  SKIP_2_WORD_INDEX = 'SKIP_2_WORD_INDEX', // 跳过两个单词索引
  REPEAT_CHAPTER = 'REPEAT_CHAPTER', // 重复章节
  NEXT_CHAPTER = 'NEXT_CHAPTER', // 下一个章节
  TOGGLE_WORD_VISIBLE = 'TOGGLE_WORD_VISIBLE', // 切换单词可见性
  TOGGLE_TRANS_VISIBLE = 'TOGGLE_TRANS_VISIBLE', // 切换翻译可见性
  TICK_TIMER = 'TICK_TIMER', // 计时器
  ADD_WORD_RECORD_ID = 'ADD_WORD_RECORD_ID', // 添加单词记录ID
  SET_IS_SAVING_RECORD = 'SET_IS_SAVING_RECORD', // 设置是否正在保存记录
  SET_IS_LOOP_SINGLE_WORD = 'SET_IS_LOOP_SINGLE_WORD', // 设置是否循环单个单词
  TOGGLE_IS_LOOP_SINGLE_WORD = 'TOGGLE_IS_LOOP_SINGLE_WORD', // 切换是否循环单个单词
  SET_REVISION_INDEX = 'SET_REVISION_INDEX', // 设置复习索引
}

/**
 * 状态动作
 */
export type TypingStateAction =
  | { type: TypingStateActionType.SETUP_CHAPTER; payload: { words: WordWithIndex[]; shouldShuffle: boolean; initialIndex?: number } }
  | { type: TypingStateActionType.SET_IS_SKIP; payload: boolean }
  | { type: TypingStateActionType.SET_IS_TYPING; payload: boolean }
  | { type: TypingStateActionType.TOGGLE_IS_TYPING }
  | { type: TypingStateActionType.REPORT_WRONG_WORD; payload: { letterMistake: LetterMistakes } }
  | { type: TypingStateActionType.REPORT_CORRECT_WORD }
  | {
      type: TypingStateActionType.NEXT_WORD
      payload?: {
        updateReviewRecord?: (state: TypingState) => void
      }
    }
  | { type: TypingStateActionType.LOOP_CURRENT_WORD }
  | { type: TypingStateActionType.FINISH_CHAPTER }
  | { type: TypingStateActionType.SKIP_WORD }
  | { type: TypingStateActionType.SKIP_2_WORD_INDEX; newIndex: number }
  | { type: TypingStateActionType.REPEAT_CHAPTER; shouldShuffle: boolean }
  | { type: TypingStateActionType.NEXT_CHAPTER }
  | { type: TypingStateActionType.TOGGLE_TRANS_VISIBLE }
  | { type: TypingStateActionType.TICK_TIMER; addTime?: number }
  | { type: TypingStateActionType.ADD_WORD_RECORD_ID; payload: number }
  | { type: TypingStateActionType.SET_IS_SAVING_RECORD; payload: boolean }
  | { type: TypingStateActionType.SET_IS_LOOP_SINGLE_WORD; payload: boolean }
  | { type: TypingStateActionType.TOGGLE_IS_LOOP_SINGLE_WORD }

/**
 * 状态分发
 */
type Dispatch = (action: TypingStateAction) => void

/**
 * 状态reducer
 * @param state 当前状态
 * @param action 动作
 * @returns 新状态
 */
export const typingReducer = (state: TypingState, action: TypingStateAction) => {
  switch (action.type) {
    case TypingStateActionType.SETUP_CHAPTER: {
      // 创建新状态
      const newState = structuredClone(initialState)
      // 处理单词列表
      const words = action.payload.shouldShuffle ? shuffle(action.payload.words) : action.payload.words
      // 处理初始索引
      let initialIndex = action.payload.initialIndex ?? 0
      if (initialIndex >= words.length) {
        initialIndex = 0
      }
      // 设置初始索引
      newState.chapterData.index = initialIndex
      // 设置单词列表
      newState.chapterData.words = words
      // 设置用户输入日志
      newState.chapterData.userInputLogs = words.map((_, index) => ({ ...structuredClone(initialUserInputLog), index }))

      return newState
    }
    // 设置是否显示跳过按钮
    case TypingStateActionType.SET_IS_SKIP:
      state.isShowSkip = action.payload
      break
    // 设置是否正在输入
    case TypingStateActionType.SET_IS_TYPING:
      state.isTyping = action.payload
      break

    // 切换是否正在输入
    case TypingStateActionType.TOGGLE_IS_TYPING:
      state.isTyping = !state.isTyping
      break
    // 报告正确单词
    case TypingStateActionType.REPORT_CORRECT_WORD: {
      // 增加正确次数
      state.chapterData.correctCount += 1

      // 获取当前单词日志
      const wordLog = state.chapterData.userInputLogs[state.chapterData.index]
      // 增加正确次数
      wordLog.correctCount += 1
      break
    }
    // 报告错误单词
    case TypingStateActionType.REPORT_WRONG_WORD: {
      // 增加错误次数
      state.chapterData.wrongCount += 1

      // 获取错误信息
      const letterMistake = action.payload.letterMistake
      const wordLog = state.chapterData.userInputLogs[state.chapterData.index]
      wordLog.wrongCount += 1
      wordLog.LetterMistakes = mergeLetterMistake(wordLog.LetterMistakes, letterMistake)
      break
    }
    case TypingStateActionType.NEXT_WORD: {
      state.chapterData.index += 1
      state.chapterData.wordCount += 1
      state.isShowSkip = false

      if (action?.payload?.updateReviewRecord) {
        action.payload.updateReviewRecord(state)
      }
      break
    }
    case TypingStateActionType.LOOP_CURRENT_WORD:
      state.isShowSkip = false
      state.chapterData.wordCount += 1
      break
    case TypingStateActionType.FINISH_CHAPTER:
      state.chapterData.wordCount += 1
      state.isTyping = false
      state.isFinished = true
      state.isShowSkip = false
      break
    case TypingStateActionType.SKIP_WORD: {
      const newIndex = state.chapterData.index + 1
      if (newIndex >= state.chapterData.words.length) {
        state.isTyping = false
        state.isFinished = true
      } else {
        state.chapterData.index = newIndex
      }
      state.isShowSkip = false
      break
    }
    case TypingStateActionType.SKIP_2_WORD_INDEX: {
      const newIndex = action.newIndex
      if (newIndex >= state.chapterData.words.length) {
        state.isTyping = false
        state.isFinished = true
      }
      state.chapterData.index = newIndex
      break
    }
    case TypingStateActionType.REPEAT_CHAPTER: {
      const newState = structuredClone(initialState)
      newState.chapterData.userInputLogs = state.chapterData.words.map((_, index) => ({ ...structuredClone(initialUserInputLog), index }))
      newState.isTyping = true
      newState.chapterData.words = action.shouldShuffle ? shuffle(state.chapterData.words) : state.chapterData.words
      newState.isTransVisible = state.isTransVisible
      return newState
    }
    case TypingStateActionType.NEXT_CHAPTER: {
      const newState = structuredClone(initialState)
      newState.chapterData.userInputLogs = state.chapterData.words.map((_, index) => ({ ...structuredClone(initialUserInputLog), index }))
      newState.isTyping = true
      newState.isTransVisible = state.isTransVisible
      return newState
    }
    case TypingStateActionType.TOGGLE_TRANS_VISIBLE:
      state.isTransVisible = !state.isTransVisible
      break
    case TypingStateActionType.TICK_TIMER: {
      const increment = action.addTime === undefined ? 1 : action.addTime
      const newTime = state.timerData.time + increment
      const inputSum =
        state.chapterData.correctCount + state.chapterData.wrongCount === 0
          ? 1
          : state.chapterData.correctCount + state.chapterData.wrongCount

      state.timerData.time = newTime
      state.timerData.accuracy = Math.round((state.chapterData.correctCount / inputSum) * 100)
      state.timerData.wpm = Math.round((state.chapterData.wordCount / newTime) * 60)
      break
    }
    case TypingStateActionType.ADD_WORD_RECORD_ID: {
      state.chapterData.wordRecordIds.push(action.payload)
      break
    }
    case TypingStateActionType.SET_IS_SAVING_RECORD: {
      state.isSavingRecord = action.payload
      break
    }
    case TypingStateActionType.SET_IS_LOOP_SINGLE_WORD: {
      state.isLoopSingleWord = action.payload
      break
    }
    case TypingStateActionType.TOGGLE_IS_LOOP_SINGLE_WORD: {
      state.isLoopSingleWord = !state.isLoopSingleWord
      break
    }
    default: {
      return state
    }
  }
}

export const TypingContext = createContext<{ state: TypingState; dispatch: Dispatch } | null>(null)
