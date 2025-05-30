import type { WordUpdateAction } from '../InputHandler'
import InputHandler from '../InputHandler'
import Letter from './Letter'
import Notation from './Notation'
import { TipAlert } from './TipAlert'
import style from './index.module.css'
import { initialWordState } from './type'
import type { WordState } from './type'
import Tooltip from '@/components/Tooltip'
import type { WordPronunciationIconRef } from '@/components/WordPronunciationIcon'
import { WordPronunciationIcon } from '@/components/WordPronunciationIcon'
import { EXPLICIT_SPACE } from '@/constants'
import useKeySounds from '@/hooks/useKeySounds'
import { TypingContext, TypingStateActionType } from '@/pages/Typing/store'
import {
  currentChapterAtom,
  currentDictInfoAtom,
  isIgnoreCaseAtom,
  isShowAnswerOnHoverAtom,
  isTextSelectableAtom,
  pronunciationIsOpenAtom,
  wordDictationConfigAtom,
} from '@/store'
import type { Word } from '@/typings'
import { CTRL, getUtcStringForMixpanel, useMixPanelWordLogUploader } from '@/utils'
import { useSaveWordRecord } from '@/utils/db'
import { useAtomValue } from 'jotai'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useImmer } from 'use-immer'

/**
 * 元音字母
 */
const vowelLetters = ['A', 'E', 'I', 'O', 'U']

/**
 * 单词
 * 用于显示单词
 * @param word 单词
 * @param onFinish 完成事件
 * @returns 单词
 */
export default function WordComponent({ word, onFinish }: { word: Word; onFinish: () => void }) {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!
  /**
   * 单词状态
   */
  const [wordState, setWordState] = useImmer<WordState>(structuredClone(initialWordState))

  /**
   * 单词发音配置
   */
  const wordDictationConfig = useAtomValue(wordDictationConfigAtom)
  /**
   * 是否可选择文本
   */
  const isTextSelectable = useAtomValue(isTextSelectableAtom)
  /**
   * 是否忽略大小写
   */
  const isIgnoreCase = useAtomValue(isIgnoreCaseAtom)
  /**
   * 是否显示答案
   */
  const isShowAnswerOnHover = useAtomValue(isShowAnswerOnHoverAtom)
  /**
   * 保存单词记录
   */
  const saveWordRecord = useSaveWordRecord()
  /**
   * 单词日志上传器
   */
  const wordLogUploader = useMixPanelWordLogUploader(state)
  /**
   * 是否打开发音
   */
  const pronunciationIsOpen = useAtomValue(pronunciationIsOpenAtom)
  /**
   * 是否悬停单词
   */
  const [isHoveringWord, setIsHoveringWord] = useState(false)
  /**
   * 当前语言
   */
  const currentLanguage = useAtomValue(currentDictInfoAtom).language
  /**
   * 当前语言分类
   */
  const currentLanguageCategory = useAtomValue(currentDictInfoAtom).languageCategory
  /**
   * 当前章节
   */
  const currentChapter = useAtomValue(currentChapterAtom)

  /**
   * 是否显示提示
   */
  const [showTipAlert, setShowTipAlert] = useState(false)
  /**
   * 单词发音图标引用
   */
  const wordPronunciationIconRef = useRef<WordPronunciationIconRef>(null)

  /**
   * 使用效果
   */
  useEffect(() => {
    // run only when word changes
    let headword = ''
    try {
      // 第一步：将普通空格替换为特殊空格字符（如不间断空格）
      // 目的：确保空格在UI渲染中不会被忽略或折叠，保持单词格式完整性
      headword = word.name.replace(new RegExp(' ', 'g'), EXPLICIT_SPACE)

      // 第二步：将省略号字符替换为两个连续的点号
      // 目的：统一省略号的显示格式，或适配特定输入/显示要求
      headword = headword.replace(new RegExp('…', 'g'), '..')
    } catch (e) {
      // 如果转换失败，则使用空字符串
      console.error('word.name is not a string', word)
      headword = ''
    }

    /**
     * 创建新的单词状态
     */
    const newWordState = structuredClone(initialWordState)
    /**
     * 设置单词状态
     */
    newWordState.displayWord = headword
    /**
     * 设置字母状态
     */
    newWordState.letterStates = new Array(headword.length).fill('normal')
    /**
     * 设置开始时间
     */
    newWordState.startTime = getUtcStringForMixpanel()
    /**
     * 设置随机字母可见性
     */
    newWordState.randomLetterVisible = headword.split('').map(() => Math.random() > 0.4)
    /**
     * 设置单词状态
     */
    setWordState(newWordState)
  }, [word, setWordState])

  /**
   * 更新输入
   * @param updateAction 更新动作
   */
  const updateInput = useCallback(
    /**
     * 更新输入
     * @param updateAction 更新动作
     * @returns 更新输入
     */
    (updateAction: WordUpdateAction) => {
      /**
       * 根据更新动作类型进行处理
       */
      switch (updateAction.type) {
        case 'add':
          // 如果单词状态有错误，则不进行处理
          if (wordState.hasWrong) return

          // 如果输入值为空格，则进行特殊处理
          if (updateAction.value === ' ') {
            // 阻止默认事件
            updateAction.event.preventDefault()
            // 设置输入值
            setWordState((state) => {
              // 添加不间断空格
              state.inputWord = state.inputWord + EXPLICIT_SPACE
            })
          } else {
            // 设置输入值
            setWordState((state) => {
              // 添加输入值
              state.inputWord = state.inputWord + updateAction.value
            })
          }
          break

        default:
          // 如果更新动作类型未知，则打印警告
          console.warn('unknown update type', updateAction)
      }
    },
    /**
     * 依赖项
     */
    [wordState.hasWrong, setWordState],
  )

  /**
   * 处理悬停单词
   * @param checked 是否悬停单词
   */
  const handleHoverWord = useCallback((checked: boolean) => {
    // 设置是否悬停单词
    setIsHoveringWord(checked)
  }, [])

  /**
   * 使用快捷键
   * @param key 快捷键
   * @param callback 回调函数
   * @param options 选项
   */
  useHotkeys(
    'tab',
    () => {
      // 处理悬停单词
      handleHoverWord(true)
    },
    /**
     * 选项
     */
    { enableOnFormTags: true, preventDefault: true },
    [],
  )

  /**
   * 使用快捷键
   * @param key 快捷键
   * @param callback 回调函数
   * @param options 选项
   */
  useHotkeys(
    'tab',
    () => {
      // 处理悬停单词
      handleHoverWord(false)
    },
    { enableOnFormTags: true, keyup: true, preventDefault: true },
    [],
  )

  /**
   * 使用快捷键
   * @param key 快捷键
   * @param callback 回调函数
   * @param options 选项
   */
  useHotkeys(
    'ctrl+j',
    () => {
      // 如果打字状态为开启，则播放发音
      if (state.isTyping) {
        /**
         * 播放发音
         */
        wordPronunciationIconRef.current?.play()
      }
    },
    /**
     * 依赖项
     */
    [state.isTyping],
    /**
     * 选项
     */
    { enableOnFormTags: true, preventDefault: true },
  )

  /**
   * 使用效果
   */
  useEffect(() => {
    // 如果输入字数为0，并且打字状态为开启，则播放发音
    if (wordState.inputWord.length === 0 && state.isTyping) {
      // 如果发音图标引用存在，则播放发音
      wordPronunciationIconRef.current?.play && wordPronunciationIconRef.current?.play()
    }
  }, [state.isTyping, wordState.inputWord.length, wordPronunciationIconRef.current?.play])

  /**
   * 获取字母可见性
   * @param index 索引
   * @returns 字母可见性
   */
  const getLetterVisible = useCallback(
    /**
     * 获取字母可见性
     * @param index 索引
     * @returns 字母可见性
     */
    (index: number) => {
      // 如果字母状态为正确，或者悬停单词，则返回 true
      if (wordState.letterStates[index] === 'correct' || (isShowAnswerOnHover && isHoveringWord)) return true

      /**
       * 如果发音配置为开启，则根据配置类型返回字母可见性
       */
      if (wordDictationConfig.isOpen) {
        // 如果发音配置类型为隐藏所有，则返回 false
        if (wordDictationConfig.type === 'hideAll') return false

        // 获取字母
        const letter = wordState.displayWord[index]
        // 如果发音配置类型为隐藏元音，则返回字母是否为元音
        if (wordDictationConfig.type === 'hideVowel') {
          // 如果字母为元音，则返回 false
          return vowelLetters.includes(letter.toUpperCase()) ? false : true
        }
        // 如果发音配置类型为隐藏辅音，则返回字母是否为辅音
        if (wordDictationConfig.type === 'hideConsonant') {
          // 如果字母为辅音，则返回 false
          return vowelLetters.includes(letter.toUpperCase()) ? true : false
        }
        // 如果发音配置类型为随机隐藏，则返回随机字母可见性
        if (wordDictationConfig.type === 'randomHide') {
          // 返回随机字母可见性
          return wordState.randomLetterVisible[index]
        }
      }
      // 如果字母状态为正确，或者悬停单词，则返回 true
      return true
    },
    [
      isHoveringWord, // 是否悬停单词
      isShowAnswerOnHover, // 是否显示答案
      wordDictationConfig.isOpen, // 是否打开发音
      wordDictationConfig.type, // 发音配置类型
      wordState.displayWord, // 显示单词
      wordState.letterStates, // 字母状态
      wordState.randomLetterVisible, // 随机字母可见性
    ],
  )

  /**
   * 使用效果
   */
  useEffect(() => {
    // 获取输入长度
    const inputLength = wordState.inputWord.length
    /**
     * TODO: 当用户输入错误时，会报错
     * Cannot update a component (`App`) while rendering a different component (`WordComponent`). To locate the bad setState() call inside `WordComponent`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render
     * 目前不影响生产环境，猜测是因为开发环境下 react 会两次调用 useEffect 从而展示了这个 warning
     * 但这终究是一个 bug，需要修复
     */
    if (wordState.hasWrong || inputLength === 0 || wordState.displayWord.length === 0) {
      return
    }

    /**
     * 获取输入字符
     */
    const inputChar = wordState.inputWord[inputLength - 1]
    /**
     * 获取正确字符
     */
    const correctChar = wordState.displayWord[inputLength - 1]
    /**
     * 判断输入字符是否与正确字符相等
     */
    let isEqual = false
    // 如果输入字符和正确字符不为空，则判断是否相等
    if (inputChar != undefined && correctChar != undefined) {
      // 如果忽略大小写，则将输入字符和正确字符转换为小写后比较
      isEqual = isIgnoreCase ? inputChar.toLowerCase() === correctChar.toLowerCase() : inputChar === correctChar
    }

    if (isEqual) {
      // 添加输入时间
      setWordState((state) => {
        // 添加输入时间
        state.letterTimeArray.push(Date.now())
        // 增加正确字数
        state.correctCount += 1
      })

      // 如果输入长度大于等于显示单词长度，则完成输入
      if (inputLength >= wordState.displayWord.length) {
        // 完成输入时
        setWordState((state) => {
          // 设置字母状态为正确
          state.letterStates[inputLength - 1] = 'correct'
          // 设置完成状态
          state.isFinished = true
          // 设置结束时间
          state.endTime = getUtcStringForMixpanel()
        })
        // 播放提示音
        playHintSound()
      } else {
        // 设置字母状态为正确
        setWordState((state) => {
          // 设置字母状态为正确
          state.letterStates[inputLength - 1] = 'correct'
        })
        // 播放按键音
        playKeySound()
      }

      // 报告正确单词
      dispatch({ type: TypingStateActionType.REPORT_CORRECT_WORD })
    } else {
      // 出错时
      playBeepSound()
      // 设置字母状态为错误
      setWordState((state) => {
        // 设置字母状态为错误
        state.letterStates[inputLength - 1] = 'wrong'
        // 设置有错误
        state.hasWrong = true
        // 设置有输入错误
        state.hasMadeInputWrong = true
        // 增加错误字数
        state.wrongCount += 1
        // 清空输入时间数组
        state.letterTimeArray = []

        // 如果字母错误数组存在，则添加输入字符
        if (state.letterMistake[inputLength - 1]) {
          // 添加输入字符
          state.letterMistake[inputLength - 1].push(inputChar)
        } else {
          // 设置字母错误数组
          state.letterMistake[inputLength - 1] = [inputChar]
        }

        // 获取当前状态
        const currentState = JSON.parse(JSON.stringify(state))
        // 报告错误单词
        dispatch({ type: TypingStateActionType.REPORT_WRONG_WORD, payload: { letterMistake: currentState.letterMistake } })
      })

      // 如果当前章节为0，并且当前章节索引为0，并且错误字数大于等于3，则显示提示
      if (currentChapter === 0 && state.chapterData.index === 0 && wordState.wrongCount >= 3) {
        // 设置显示提示
        setShowTipAlert(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordState.inputWord])

  /**
   * 使用效果
   */
  useEffect(() => {
    // 如果单词状态有错误
    if (wordState.hasWrong) {
      // 设置定时器
      const timer = setTimeout(() => {
        // 设置输入字符
        setWordState((state) => {
          // 清空输入字符
          state.inputWord = ''
          // 设置字母状态为正常
          state.letterStates = new Array(state.letterStates.length).fill('normal')
          // 设置有错误
          state.hasWrong = false
        })
      }, 300)

      return () => {
        // 清除定时器
        clearTimeout(timer)
      }
    }
  }, [wordState.hasWrong, setWordState])

  /**
   * 使用效果
   */
  useEffect(() => {
    // 如果单词状态为完成
    if (wordState.isFinished) {
      // 设置保存记录状态
      dispatch({ type: TypingStateActionType.SET_IS_SAVING_RECORD, payload: true })

      // 上传单词日志
      wordLogUploader({
        headword: word.name, // 单词
        timeStart: wordState.startTime, // 开始时间
        timeEnd: wordState.endTime, // 结束时间
        countInput: wordState.correctCount + wordState.wrongCount, // 输入字数
        countCorrect: wordState.correctCount, // 正确字数
        countTypo: wordState.wrongCount, // 错误字数
      })

      // 保存单词记录
      saveWordRecord({
        word: word.name, // 单词
        wrongCount: wordState.wrongCount, // 错误字数
        letterTimeArray: wordState.letterTimeArray, // 输入时间数组
        letterMistake: wordState.letterMistake, // 字母错误数组
      })

      // 完成时
      onFinish()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordState.isFinished])

  /**
   * 使用效果
   */
  useEffect(() => {
    // 如果错误字数大于等于4，则设置跳过状态
    if (wordState.wrongCount >= 4) {
      // 设置跳过状态
      dispatch({ type: TypingStateActionType.SET_IS_SKIP, payload: true })
    }
  }, [wordState.wrongCount, dispatch])

  /**
   * 播放按键音
   */
  const [playKeySound, playBeepSound, playHintSound] = useKeySounds()

  return (
    <>
      <InputHandler updateInput={updateInput} />
      <div
        lang={currentLanguageCategory !== 'code' ? currentLanguageCategory : 'en'}
        className="flex flex-col items-center justify-center pb-1 pt-4"
      >
        {['romaji', 'hapin'].includes(currentLanguage) && word.notation && <Notation notation={word.notation} />}
        <div
          className={`tooltip-info relative w-fit bg-transparent p-0 leading-normal shadow-none dark:bg-transparent ${
            wordDictationConfig.isOpen ? 'tooltip' : ''
          }`}
          data-tip="按 Tab 快捷键显示完整单词"
        >
          <div
            onMouseEnter={() => handleHoverWord(true)}
            onMouseLeave={() => handleHoverWord(false)}
            className={`flex items-center ${isTextSelectable && 'select-all'} justify-center ${wordState.hasWrong ? style.wrong : ''}`}
          >
            {wordState.displayWord.split('').map((t, index) => {
              return <Letter key={`${index}-${t}`} letter={t} visible={getLetterVisible(index)} state={wordState.letterStates[index]} />
            })}
          </div>
          {pronunciationIsOpen && (
            <div className="absolute -right-12 top-1/2 h-9 w-9 -translate-y-1/2 transform ">
              <Tooltip content={`快捷键${CTRL} + J`}>
                <WordPronunciationIcon word={word} lang={currentLanguage} ref={wordPronunciationIconRef} className="h-full w-full" />
              </Tooltip>
            </div>
          )}
        </div>
      </div>
      <TipAlert className="fixed bottom-10 right-3" show={showTipAlert} setShow={setShowTipAlert} />
    </>
  )
}
