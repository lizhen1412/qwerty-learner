import { TypingContext, TypingStateActionType } from '../../store'
import Tooltip from '@/components/Tooltip'
import { currentDictInfoAtom, wordDictationConfigAtom } from '@/store'
import { CTRL } from '@/utils'
import { useAtomValue } from 'jotai'
import { useCallback, useContext, useMemo } from 'react'
import IconPrev from '~icons/tabler/arrow-narrow-left'
import IconNext from '~icons/tabler/arrow-narrow-right'

/**
 * 上一个/下一个单词组件
 * 用于在单词学习界面中显示当前单词的上一个或下一个单词预览
 * 支持快捷键导航和听写模式下的单词隐藏功能
 */
export default function PrevAndNextWord({ type }: LastAndNextWordProps) {
  // 通过上下文获取全局状态和调度函数
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!

  // 获取单词听写配置
  const wordDictationConfig = useAtomValue(wordDictationConfigAtom)
  // 计算要显示的单词索引：根据type参数决定是上一个还是下一个单词
  const newIndex = useMemo(() => state.chapterData.index + (type === 'prev' ? -1 : 1), [state.chapterData.index, type])
  // 获取对应索引的单词数据
  const word = state.chapterData.words[newIndex]
  // 生成快捷键提示文本
  const shortCutKey = useMemo(() => (type === 'prev' ? `${CTRL} + Shift + ArrowLeft` : `${CTRL} + Shift + ArrowRight`), [type])
  // 获取当前设置的语言
  const currentLanguage = useAtomValue(currentDictInfoAtom).language

  /**
   * 点击单词时的回调函数
   * 导航到上一个或下一个单词
   */
  const onClickWord = useCallback(() => {
    // 没有单词数据则不执行操作
    if (!word) return

    // 根据type参数决定导航方向，更新当前单词索引
    if (type === 'prev') dispatch({ type: TypingStateActionType.SKIP_2_WORD_INDEX, newIndex })
    if (type === 'next') dispatch({ type: TypingStateActionType.SKIP_2_WORD_INDEX, newIndex })
  }, [type, dispatch, newIndex, word])

  /**
   * 计算要显示的单词文本
   * 在听写模式下，下一个单词会被隐藏为下划线
   */
  const headWord = useMemo(() => {
    // 没有单词数据则返回空字符串
    if (!word) return ''

    // 根据当前语言和听写模式决定显示的单词
    const showWord = ['romaji', 'hapin'].includes(currentLanguage) ? word.notation : word.name
    // 如果type为prev，则返回显示的单词
    if (type === 'prev') return showWord
    // 如果type为next，则根据听写模式决定显示的单词
    if (type === 'next') {
      return !wordDictationConfig.isOpen ? showWord : (showWord || '').replace(/./g, '_')
    }
  }, [word, currentLanguage, type, wordDictationConfig.isOpen])

  return (
    <>
      {word ? (
        <Tooltip content={`快捷键: ${shortCutKey}`}>
          <div
            onClick={onClickWord}
            className="flex max-w-xs cursor-pointer select-none items-center text-gray-700 opacity-60 duration-200 ease-in-out hover:opacity-100 dark:text-gray-400"
          >
            {type === 'prev' && <IconPrev className="mr-4 shrink-0 grow-0 text-2xl" />}

            <div className={`grow-1 flex w-full flex-col ${type === 'next' ? 'items-end text-right' : ''}`}>
              <p
                className={`font-mono text-2xl font-normal text-gray-700 dark:text-gray-400 ${
                  !wordDictationConfig.isOpen ? 'tracking-normal' : 'tracking-wider'
                }`}
              >
                {headWord}
              </p>
              {state.isTransVisible && (
                <p className="line-clamp-1 max-w-full text-sm font-normal text-gray-600 dark:text-gray-500">{word.trans.join('；')}</p>
              )}
            </div>
            {type === 'next' && <IconNext className="ml-4 shrink-0 grow-0 text-2xl" />}
          </div>
        </Tooltip>
      ) : (
        <div />
      )}
    </>
  )
}

export type LastAndNextWordProps = {
  /** 上一个单词还是下一个单词 */
  type: 'prev' | 'next'
}
