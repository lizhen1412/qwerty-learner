import { useChapterStats } from '../hooks/useChapterStats'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { useEffect, useRef } from 'react'
import IconCheckCircle from '~icons/heroicons/check-circle-solid'

/**
 * 章节
 * @param param0
 * @returns
 */
export default function Chapter({
  index, // 索引
  checked, // 是否选中
  dictID, // 词典 ID
  onChange, // 改变
}: {
  index: number // 索引
  checked: boolean // 是否选中
  dictID: string // 词典 ID
  onChange: (index: number) => void // 改变
}) {
  /**
   * 引用
   */
  const ref = useRef<HTMLTableRowElement>(null)

  /**
   * 使用交叉观察器
   */
  const entry = useIntersectionObserver(ref, {})
  /**
   * 是否可见
   */
  const isVisible = !!entry?.isIntersecting
  /**
   * 章节统计
   */
  const chapterStatus = useChapterStats(index, dictID, isVisible)

  /**
   * 使用 useEffect 监听选中状态
   */
  useEffect(() => {
    /**
     * 如果选中且引用不为空，则滚动到引用
     */
    if (checked && ref.current !== null) {
      /**
       * 按钮
       */
      const button = ref.current
      /**
       * 容器
       */
      const container = button.parentElement?.parentElement?.parentElement
      /**
       * 滚动到按钮
       */
      container?.scroll({
        /**
         * 滚动到按钮
         */
        top: button.offsetTop - container.offsetTop - 300,
        /**
         * 行为
         */
        behavior: 'smooth', // 平滑滚动
      })
    }
  }, [checked])

  /**
   * 返回章节
   * @returns 章节
   */
  return (
    <div
      ref={ref}
      className="relative flex h-16 w-40 cursor-pointer  flex-col items-start justify-center overflow-hidden rounded-xl bg-slate-100 px-3 py-2 dark:bg-slate-800"
      onClick={() => onChange(index)}
    >
      <h1>第 {index + 1} 章</h1>
      <p className="pt-[2px] text-xs text-slate-600">
        {chapterStatus ? (chapterStatus.exerciseCount > 0 ? `练习 ${chapterStatus.exerciseCount} 次` : '未练习') : '加载中...'}
      </p>
      {checked && (
        <IconCheckCircle className="absolute -bottom-4 -right-4 h-18 w-18 text-6xl text-green-500 opacity-40 dark:text-green-300" />
      )}
    </div>
  )
}
