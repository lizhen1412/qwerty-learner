import { TypingContext, TypingStateActionType } from '../../store'
import type { TypingState } from '../../store/type'
import PrevAndNextWord from '../PrevAndNextWord'
import Progress from '../Progress'
import Phonetic from './components/Phonetic'
import Translation from './components/Translation'
import WordComponent from './components/Word'
import { usePrefetchPronunciationSound } from '@/hooks/usePronunciation'
import { isReviewModeAtom, isShowPrevAndNextWordAtom, loopWordConfigAtom, phoneticConfigAtom, reviewModeInfoAtom } from '@/store'
import type { Word } from '@/typings'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useContext, useMemo, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

// 单词面板主组件
export default function WordPanel() {
  // 从上下文中获取状态和dispatch函数
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!

  // 从原子状态中获取各种配置
  const phoneticConfig = useAtomValue(phoneticConfigAtom) // 音标显示配置
  const isShowPrevAndNextWord = useAtomValue(isShowPrevAndNextWordAtom) // 是否显示前一个和后一个单词

  // 组件内部状态
  const [wordComponentKey, setWordComponentKey] = useState(0) // 单词组件的key，用于强制重新渲染
  const [currentWordExerciseCount, setCurrentWordExerciseCount] = useState(0) // 当前单词的练习次数
  const { times: loopWordTimes } = useAtomValue(loopWordConfigAtom) // 循环单词次数

  // 获取当前和下一个单词
  const currentWord = state.chapterData.words[state.chapterData.index] // 当前单词
  const nextWord = state.chapterData.words[state.chapterData.index + 1] as Word | undefined // 下一个单词

  // 获取当前和下一个单词
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom) // 设置复习模式信息
  const isReviewMode = useAtomValue(isReviewModeAtom) // 是否是复习模式

  // 计算上一个和下一个单词的索引
  const prevIndex = useMemo(() => {
    const newIndex = state.chapterData.index - 1 // 前一个单词的索引
    return newIndex < 0 ? 0 : newIndex // 如果前一个单词的索引小于0，则返回0
  }, [state.chapterData.index])
  const nextIndex = useMemo(() => {
    const newIndex = state.chapterData.index + 1 // 下一个单词的索引
    return newIndex > state.chapterData.words.length - 1 ? state.chapterData.words.length - 1 : newIndex
  }, [state.chapterData.index, state.chapterData.words.length])

  // 预加载下一个单词的发音
  usePrefetchPronunciationSound(nextWord?.name)

  // 强制重渲染当前单词组件
  const reloadCurrentWordComponent = useCallback(() => {
    setWordComponentKey((old) => old + 1)
  }, [])

  // 更新复习记录
  const updateReviewRecord = useCallback(
    (state: TypingState) => {
      setReviewModeInfo((old) => ({
        ...old,
        reviewRecord: old.reviewRecord ? { ...old.reviewRecord, index: state.chapterData.index } : undefined,
      }))
    },
    [setReviewModeInfo],
  )

  // 处理单词完成逻辑
  const onFinish = useCallback(() => {
    // 如果还有单词未完成或当前单词练习次数不足
    if (state.chapterData.index < state.chapterData.words.length - 1 || currentWordExerciseCount < loopWordTimes - 1) {
      // 用户完成当前单词
      if (currentWordExerciseCount < loopWordTimes - 1) {
        // 增加当前单词练习次数
        setCurrentWordExerciseCount((old) => old + 1)
        // 循环当前单词
        dispatch({ type: TypingStateActionType.LOOP_CURRENT_WORD })
        // 强制重渲染当前单词组件
        reloadCurrentWordComponent()
      } else {
        // 重置当前单词练习次数
        setCurrentWordExerciseCount(0)
        // 如果是在复习模式下
        if (isReviewMode) {
          // 跳转到下一个单词
          dispatch({
            // 跳转到下一个单词
            type: TypingStateActionType.NEXT_WORD,
            payload: {
              // 更新复习记录
              updateReviewRecord,
            },
          })
        } else {
          // 跳转到下一个单词
          dispatch({ type: TypingStateActionType.NEXT_WORD })
        }
      }
    } else {
      // 用户完成当前章节
      dispatch({ type: TypingStateActionType.FINISH_CHAPTER })
      // 如果是在复习模式下
      if (isReviewMode) {
        // 设置复习记录
        setReviewModeInfo((old) => ({ ...old, reviewRecord: old.reviewRecord ? { ...old.reviewRecord, isFinished: true } : undefined }))
      }
    }
  }, [
    // 当前单词在章节中的索引
    state.chapterData.index,
    // 当前章节单词数量
    state.chapterData.words.length,
    // 当前单词的已练习次数计数器
    currentWordExerciseCount,
    // 每个单词需要循环练习的次数配置
    loopWordTimes,
    // 状态分发函数（来自 TypingContext）
    dispatch,
    // 强制重新渲染单词组件的函数
    reloadCurrentWordComponent,
    // 是否处于复习模式的标志
    isReviewMode,
    // 更新复习记录的回调函数
    updateReviewRecord,
    // 设置复习模式信息的函数
    setReviewModeInfo,
  ])

  /**
   * 处理跳过单词逻辑
   */
  const onSkipWord = useCallback(
    (type: 'prev' | 'next') => {
      if (type === 'prev') {
        dispatch({ type: TypingStateActionType.SKIP_2_WORD_INDEX, newIndex: prevIndex })
      }

      if (type === 'next') {
        dispatch({ type: TypingStateActionType.SKIP_2_WORD_INDEX, newIndex: nextIndex })
      }
    },
    [dispatch, prevIndex, nextIndex],
  )

  useHotkeys(
    'Ctrl + Shift + ArrowLeft',
    (e) => {
      e.preventDefault()
      onSkipWord('prev')
    },
    { preventDefault: true },
  )

  useHotkeys(
    'Ctrl + Shift + ArrowRight',
    (e) => {
      e.preventDefault()
      onSkipWord('next')
    },
    { preventDefault: true },
  )
  const [isShowTranslation, setIsHoveringTranslation] = useState(false)

  /**
   * 处理显示翻译
   */
  const handleShowTranslation = useCallback((checked: boolean) => {
    setIsHoveringTranslation(checked)
  }, [])

  useHotkeys(
    'tab',
    () => {
      handleShowTranslation(true)
    },
    { enableOnFormTags: true, preventDefault: true },
    [],
  )

  useHotkeys(
    'tab',
    () => {
      handleShowTranslation(false)
    },
    { enableOnFormTags: true, keyup: true, preventDefault: true },
    [],
  )

  /**
   * 是否显示翻译
   */
  const shouldShowTranslation = useMemo(() => {
    return isShowTranslation || state.isTransVisible
  }, [isShowTranslation, state.isTransVisible])

  return (
    <div className="container flex h-full w-full flex-col items-center justify-center">
      <div className="container flex h-24 w-full shrink-0 grow-0 justify-between px-12 pt-10">
        {isShowPrevAndNextWord && state.isTyping && (
          <>
            <PrevAndNextWord type="prev" />
            <PrevAndNextWord type="next" />
          </>
        )}
      </div>
      <div className="container flex flex-grow flex-col items-center justify-center">
        {currentWord && (
          <div className="relative flex w-full justify-center">
            {!state.isTyping && (
              <div className="absolute flex h-full w-full justify-center">
                <div className="z-10 flex w-full items-center backdrop-blur-sm">
                  <p className="w-full select-none text-center text-xl text-gray-600 dark:text-gray-50">
                    按任意键{state.timerData.time ? '继续' : '开始'}
                  </p>
                </div>
              </div>
            )}
            <div className="relative">
              <WordComponent word={currentWord} onFinish={onFinish} key={wordComponentKey} />
              {phoneticConfig.isOpen && <Phonetic word={currentWord} />}
              <Translation
                trans={currentWord.trans.join('；')}
                showTrans={shouldShowTranslation}
                onMouseEnter={() => handleShowTranslation(true)}
                onMouseLeave={() => handleShowTranslation(false)}
              />
            </div>
          </div>
        )}
      </div>
      <Progress className={`mb-10 mt-auto ${state.isTyping ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  )
}
