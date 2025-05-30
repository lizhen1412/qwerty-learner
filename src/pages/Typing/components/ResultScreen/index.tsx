import { TypingContext, TypingStateActionType } from '../../store'
import ShareButton from '../ShareButton'
import { AuthorButton } from './AuthorButton'
import ConclusionBar from './ConclusionBar'
import RemarkRing from './RemarkRing'
import WordChip from './WordChip'
import styles from './index.module.css'
import Tooltip from '@/components/Tooltip'
import {
  currentChapterAtom,
  currentDictInfoAtom,
  infoPanelStateAtom,
  isReviewModeAtom,
  randomConfigAtom,
  reviewModeInfoAtom,
  wordDictationConfigAtom,
} from '@/store'
import type { InfoPanelType } from '@/typings'
import { recordOpenInfoPanelAction } from '@/utils'
import { Transition } from '@headlessui/react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'
import IexportWords from '~icons/icon-park-outline/excel'
import IconCoffee from '~icons/mdi/coffee'
import IconXiaoHongShu from '~icons/my-icons/xiaohongshu'
import IconGithub from '~icons/simple-icons/github'
import IconWechat from '~icons/simple-icons/wechat'
import IconX from '~icons/tabler/x'

/**
 * 结果屏幕
 * 用于显示打字结果和相关操作
 * @returns 结果屏幕
 */
const ResultScreen = () => {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!

  /**
   * 设置单词听写配置
   */
  const setWordDictationConfig = useSetAtom(wordDictationConfigAtom)
  /**
   * 当前词典信息
   */
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  /**
   * 当前章节
   */
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom)
  /**
   * 设置信息面板状态
   */
  const setInfoPanelState = useSetAtom(infoPanelStateAtom)
  /**
   * 随机配置
   */
  const randomConfig = useAtomValue(randomConfigAtom)
  /**
   * 导航
   */
  const navigate = useNavigate()
  /**
   * 设置复习模式信息
   */
  const setReviewModeInfo = useSetAtom(reviewModeInfoAtom)
  /**
   * 是否复习模式
   */
  const isReviewMode = useAtomValue(isReviewModeAtom)

  /**
   * 使用效果
   */
  useEffect(() => {
    // tick a zero timer to calc the stats
    dispatch({ type: TypingStateActionType.TICK_TIMER, addTime: 0 })
  }, [dispatch])

  /**
   * 导出单词
   */
  const exportWords = useCallback(() => {
    const { words, userInputLogs } = state.chapterData
    /**
     * 导出数据
     */
    const exportData = userInputLogs.map((log) => {
      /**
       * 单词
       */
      const word = words[log.index]
      /**
       * 单词名称
       */
      const wordName = word.name
      /**
       * 导出数据
       */
      return {
        ...word, // 单词
        trans: word.trans.join(';'), // 单词释义
        correctCount: log.correctCount, // 正确数量
        wrongCount: log.wrongCount, // 错误数量
        wrongLetters: Object.entries(log.LetterMistakes) // 错误字母
          .map(([key, mistakes]) => `${wordName[Number(key)]}:${mistakes.length}`) // 错误字母
          .join(';'), // 错误字母
      }
    })

    import('xlsx')
      .then(({ utils, writeFileXLSX }) => {
        const ws = utils.json_to_sheet(exportData)
        const wb = utils.book_new()
        utils.book_append_sheet(wb, ws, 'Data')
        writeFileXLSX(wb, `${currentDictInfo.name}第${currentChapter + 1}章.xlsx`)
      })
      .catch(() => {
        console.log('写入 xlsx 模块导入失败')
      })
  }, [currentChapter, currentDictInfo.name, state.chapterData])

  /**
   * 错误单词
   */
  const wrongWords = useMemo(() => {
    return state.chapterData.userInputLogs // 用户输入日志
      .filter((log) => log.wrongCount > 0) // 错误数量大于0
      .map((log) => state.chapterData.words[log.index]) // 单词
      .filter((word) => word !== undefined) // 单词不为空
  }, [state.chapterData.userInputLogs, state.chapterData.words])

  /**
   * 是否最后一章
   */
  const isLastChapter = useMemo(() => {
    return currentChapter >= currentDictInfo.chapterCount - 1 // 当前章节大于等于总章节数减1
  }, [currentChapter, currentDictInfo])

  /**
   * 正确率
   */
  const correctRate = useMemo(() => {
    const chapterLength = state.chapterData.words.length // 章节长度
    const correctCount = chapterLength - wrongWords.length // 正确数量
    return Math.floor((correctCount / chapterLength) * 100) // 正确率
  }, [state.chapterData.words.length, wrongWords.length]) // 依赖章节长度和错误数量

  /**
   * 错误级别
   */
  const mistakeLevel = useMemo(() => {
    if (correctRate >= 85) {
      return 0
    } else if (correctRate >= 70) {
      return 1
    } else {
      return 2
    }
  }, [correctRate])

  /**
   * 时间字符串
   */
  const timeString = useMemo(() => {
    const seconds = state.timerData.time // 秒
    const minutes = Math.floor(seconds / 60) // 分钟
    const minuteString = minutes < 10 ? '0' + minutes : minutes + '' // 分钟字符串
    const restSeconds = seconds % 60 // 剩余秒
    const secondString = restSeconds < 10 ? '0' + restSeconds : restSeconds + '' // 秒字符串
    return `${minuteString}:${secondString}` // 时间字符串
  }, [state.timerData.time])

  /**
   * 重复本章节
   */
  const repeatButtonHandler = useCallback(async () => {
    /**
     * 是否复习模式
     */
    if (isReviewMode) {
      return
    }

    /**
     * 设置单词听写配置
     */
    setWordDictationConfig((old) => {
      /**
       * 是否打开
       */
      if (old.isOpen) {
        /**
         * 是否自动打开
         */
        if (old.openBy === 'auto') {
          return { ...old, isOpen: false } // 设置单词听写配置为关闭
        }
      }
      return old // 返回旧的单词听写配置
    })
    /**
     * 重复本章节
     */
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen }) // 重复本章节
  }, [isReviewMode, setWordDictationConfig, dispatch, randomConfig.isOpen])

  /**
   * 默写本章节
   */
  const dictationButtonHandler = useCallback(async () => {
    /**
     * 是否复习模式
     */
    if (isReviewMode) {
      return
    }

    /**
     * 设置单词听写配置
     */
    setWordDictationConfig((old) => ({ ...old, isOpen: true, openBy: 'auto' })) // 设置单词听写配置为打开
    /**
     * 重复本章节
     */
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen }) // 重复本章节
  }, [isReviewMode, setWordDictationConfig, dispatch, randomConfig.isOpen])

  /**
   * 下一章节
   */
  const nextButtonHandler = useCallback(() => {
    /**
     * 是否复习模式
     */
    if (isReviewMode) {
      return
    }

    /**
     * 设置单词听写配置
     */
    setWordDictationConfig((old) => {
      /**
       * 是否打开
       */
      if (old.isOpen) {
        /**
         * 是否自动打开
         */
        if (old.openBy === 'auto') {
          return { ...old, isOpen: false } // 设置单词听写配置为关闭
        }
      }
      return old // 返回旧的单词听写配置
    })
    /**
     * 是否最后一章
     */
    if (!isLastChapter) {
      /**
       * 设置当前章节
       */
      setCurrentChapter((old) => old + 1)
      /**
       * 下一章节
       */
      dispatch({ type: TypingStateActionType.NEXT_CHAPTER })
    }
  }, [dispatch, isLastChapter, isReviewMode, setCurrentChapter, setWordDictationConfig])

  /**
   * 退出按钮
   */
  const exitButtonHandler = useCallback(() => {
    /**
     * 是否复习模式
     */
    if (isReviewMode) {
      setCurrentChapter(0) // 设置当前章节为0
      setReviewModeInfo((old) => ({ ...old, isReviewMode: false }))
    } else {
      dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: false })
    }
  }, [dispatch, isReviewMode, setCurrentChapter, setReviewModeInfo])

  /**
   * 导航到图库
   */
  const onNavigateToGallery = useCallback(() => {
    /**
     * 设置当前章节
     */
    setCurrentChapter(0)
    /**
     * 设置复习模式信息
     */
    setReviewModeInfo((old) => ({ ...old, isReviewMode: false }))
    /**
     * 导航到图库
     */
    navigate('/gallery')
  }, [navigate, setCurrentChapter, setReviewModeInfo])

  /**
   * 下一章节
   */
  useHotkeys(
    'enter',
    () => {
      nextButtonHandler()
    },
    { preventDefault: true },
  )

  /**
   * 重复本章节
   */
  useHotkeys(
    'space',
    (e) => {
      // 火狐浏览器的阻止事件无效，会导致按空格键后 再次输入正确的第一个字母会报错
      e.stopPropagation()
      repeatButtonHandler()
    },
    { preventDefault: true },
  )

  useHotkeys(
    'shift+enter',
    () => {
      dictationButtonHandler()
    },
    { preventDefault: true },
  )

  /**
   * 打开信息面板
   */
  const handleOpenInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      recordOpenInfoPanelAction(modalType, 'resultScreen')
      setInfoPanelState((state) => ({ ...state, [modalType]: true }))
    },
    [setInfoPanelState],
  )

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto">
      <div className="absolute inset-0 bg-gray-300 opacity-80 dark:bg-gray-600"></div>
      <Transition
        show={true}
        enter="ease-in duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-out duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="flex h-screen items-center justify-center">
          <div className="my-card fixed flex w-[90vw] max-w-6xl flex-col overflow-hidden rounded-3xl bg-white pb-14 pl-10 pr-5 pt-10 shadow-lg dark:bg-gray-800 md:w-4/5 lg:w-3/5">
            <div className="text-center font-sans text-xl font-normal text-gray-900 dark:text-gray-400 md:text-2xl">
              {`${currentDictInfo.name} ${isReviewMode ? '错题复习' : '第' + (currentChapter + 1) + '章'}`}
            </div>
            <button className="absolute right-7 top-5" onClick={exitButtonHandler}>
              <IconX className="text-gray-400" />
            </button>
            <div className="mt-10 flex flex-row gap-2 overflow-hidden">
              <div className="flex flex-shrink-0 flex-grow-0 flex-col gap-3 px-4 sm:px-1 md:px-2 lg:px-4">
                <RemarkRing remark={`${state.timerData.accuracy}%`} caption="正确率" percentage={state.timerData.accuracy} />
                <RemarkRing remark={timeString} caption="章节耗时" />
                <RemarkRing remark={state.timerData.wpm + ''} caption="WPM" />
              </div>
              <div className="z-10 ml-6 flex-1 overflow-visible rounded-xl bg-indigo-50 dark:bg-gray-700">
                <div className="customized-scrollbar z-20 ml-8 mr-1 flex h-80 flex-row flex-wrap content-start gap-4 overflow-y-auto overflow-x-hidden pr-7 pt-9">
                  {wrongWords.map((word, index) => (
                    <WordChip key={`${index}-${word.name}`} word={word} />
                  ))}
                </div>
                <div className="align-center flex w-full flex-row justify-start rounded-b-xl bg-indigo-200 px-4 dark:bg-indigo-400">
                  <ConclusionBar mistakeLevel={mistakeLevel} mistakeCount={wrongWords.length} />
                </div>
              </div>
              <div className="ml-2 flex flex-col items-center justify-end gap-3 text-xl">
                <AuthorButton />
                {!isReviewMode && (
                  <>
                    <ShareButton />
                    <IexportWords fontSize={18} className="cursor-pointer text-gray-500" onClick={exportWords}></IexportWords>
                  </>
                )}
                <IconXiaoHongShu
                  fontSize={15}
                  className="cursor-pointer text-gray-500 hover:text-red-500 focus:outline-none"
                  onClick={(e) => {
                    handleOpenInfoPanel('redBook')
                    e.currentTarget.blur()
                  }}
                />

                <button
                  onClick={(e) => {
                    handleOpenInfoPanel('donate')
                    e.currentTarget.blur()
                  }}
                  className="cursor-pointer"
                  type="button"
                  title="捐赠我们的项目"
                >
                  <IconCoffee fontSize={17} className={`text-gray-500 hover:text-amber-500  focus:outline-none ${styles.imgShake}`} />
                </button>

                <button
                  onClick={(e) => {
                    handleOpenInfoPanel('community')
                    e.currentTarget.blur()
                  }}
                  className="cursor-pointer text-gray-500 dark:text-gray-400"
                  type="button"
                  title="加入我们的社区"
                >
                  <IconWechat fontSize={16} className="text-gray-500 hover:text-green-500 focus:outline-none" />
                </button>

                <a href="https://github.com/Kaiyiwing/qwerty-learner" target="_blank" rel="noreferrer" className="leading-[0px]">
                  <IconGithub fontSize={16} className="text-gray-500 hover:text-green-800 focus:outline-none" />
                </a>
              </div>
            </div>
            <div className="mt-10 flex w-full justify-center gap-5 px-5 text-xl">
              {!isReviewMode && (
                <>
                  <Tooltip content="快捷键：shift + enter">
                    <button
                      className="my-btn-primary h-12 border-2 border-solid border-gray-300 bg-white text-base text-gray-700 dark:border-gray-700 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
                      type="button"
                      onClick={dictationButtonHandler}
                      title="默写本章节"
                    >
                      默写本章节
                    </button>
                  </Tooltip>
                  <Tooltip content="快捷键：space">
                    <button
                      className="my-btn-primary h-12 border-2 border-solid border-gray-300 bg-white text-base text-gray-700 dark:border-gray-700 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
                      type="button"
                      onClick={repeatButtonHandler}
                      title="重复本章节"
                    >
                      重复本章节
                    </button>
                  </Tooltip>
                </>
              )}
              {!isLastChapter && !isReviewMode && (
                <Tooltip content="快捷键：enter">
                  <button
                    className={`{ isLastChapter ? 'cursor-not-allowed opacity-50' : ''} my-btn-primary h-12 text-base font-bold `}
                    type="button"
                    onClick={nextButtonHandler}
                    title="下一章节"
                  >
                    下一章节
                  </button>
                </Tooltip>
              )}

              {isReviewMode && (
                <button
                  className="my-btn-primary h-12 text-base font-bold"
                  type="button"
                  onClick={onNavigateToGallery}
                  title="练习其他章节"
                >
                  练习其他章节
                </button>
              )}
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
}

export default ResultScreen
