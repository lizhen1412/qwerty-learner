import { useChapterStats } from './hooks/useChapterStats'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import type React from 'react'
import { useEffect, useRef } from 'react'
import IconCheckCircle from '~icons/heroicons/check-circle-solid'

/**
 * 章节按钮
 * @param param0
 * @returns
 */
export const ChapterButton: React.FC<ChapterButtonProps> = ({ index, selected, wordCount, onClick }) => {
  /**
   * 按钮引用
   */
  const buttonRef = useRef<HTMLButtonElement>(null)

  /**
   * 使用交叉观察器
   */
  const entry = useIntersectionObserver(buttonRef, {})
  /**
   * 是否可见
   */
  const isVisible = !!entry?.isIntersecting
  /**
   * 章节统计
   */
  const chapterStatus = useChapterStats(index, isVisible)

  /**
   * 使用 useEffect 监听选中状态
   */
  useEffect(() => {
    /**
     * 如果选中且按钮引用不为空，则滚动到按钮
     */
    if (selected && buttonRef.current !== null) {
      /**
       * 按钮
       */
      const button = buttonRef.current
      /**
       * 容器
       */
      const container = button.parentElement?.parentElement
      /**
       * 半高度
       */
      const halfHeight = button.getBoundingClientRect().height / 2
      /**
       * 滚动到按钮
       */
      container?.scrollTo({ top: Math.max(button.offsetTop - container.offsetTop - halfHeight, 0), behavior: 'smooth' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  /**
   * 返回章节按钮
   * @returns 章节按钮
   */
  return (
    <button
      ref={buttonRef}
      className="relative flex h-28 w-44 flex-col items-start justify-start overflow-hidden rounded-md border border-gray-300 bg-gray-50 p-4 text-left shadow-lg focus:outline-none dark:border-gray-500 dark:bg-gray-700 dark:bg-opacity-10"
      type="button"
      onClick={onClick}
      title="选择章节"
    >
      <p className="w-full pb-2 text-lg text-gray-800 dark:text-white dark:text-opacity-80">Chapter {index + 1}</p>
      <p className="text-xs font-medium text-gray-600 dark:text-white dark:text-opacity-60">单词数: {wordCount}</p>
      {chapterStatus !== null && (
        <>
          {chapterStatus.exerciseCount > 0 ? (
            <>
              <p className="text-xs font-medium text-gray-600 dark:text-white dark:text-opacity-60">
                练习次数: {chapterStatus.exerciseCount}
              </p>
              <p className="text-xs font-medium text-gray-600 dark:text-white dark:text-opacity-60">
                平均错误数: {chapterStatus.avgWrongCount}
              </p>
            </>
          ) : (
            <>
              <p className="pt-1 text-xs font-medium text-gray-600 dark:text-white dark:text-opacity-60">暂未练习</p>
            </>
          )}
        </>
      )}

      {selected ? (
        <IconCheckCircle className="absolute -bottom-4 -right-4 h-18 w-18 text-6xl text-green-500 opacity-60 dark:text-green-300" />
      ) : null}
    </button>
  )
}

export default ChapterButton

/**
 * 章节按钮属性
 */
export type ChapterButtonProps = {
  index: number // 索引
  selected: boolean // 是否选中
  wordCount: number // 单词数
  onClick: () => void // 点击事件
}
