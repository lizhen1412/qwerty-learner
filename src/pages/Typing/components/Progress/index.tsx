import { TypingContext } from '../../store'
import { useContext, useEffect, useState } from 'react'

/**
 * 进度条组件
 * 用于显示当前单词在章节中的进度
 * 支持颜色渐变和进度条动画
 * @param param0 进度条组件的类名
 * @returns 进度条组件
 */
export default function Progress({ className }: { className?: string }) {
  /**
   * 获取当前章节数据
   */
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!
  /**
   * 进度
   */
  const [progress, setProgress] = useState(0)
  /**
   * 阶段
   */
  const [phase, setPhase] = useState(0)

  /**
   * 颜色切换器
   */
  const colorSwitcher: { [key: number]: string } = {
    0: 'bg-indigo-200 dark:bg-indigo-300',
    1: 'bg-indigo-300 dark:bg-indigo-400',
    2: 'bg-indigo-400 dark:bg-indigo-500',
  }

  /**
   * 计算进度和阶段
   */
  useEffect(() => {
    /**
     * 计算进度
     */
    const newProgress = Math.floor((state.chapterData.index / state.chapterData.words.length) * 100)
    // 设置进度
    setProgress(newProgress)
    /**
     * 计算阶段
     */
    const colorPhase = Math.floor(newProgress / 33.4)
    // 设置阶段
    setPhase(colorPhase)
  }, [state.chapterData.index, state.chapterData.words.length])

  return (
    <div className={`relative w-1/4 pt-1 ${className}`}>
      <div className="mb-4 flex h-2 overflow-hidden rounded-xl bg-indigo-100 text-xs transition-all duration-300 dark:bg-indigo-200">
        <div
          style={{ width: `${progress}%` }}
          className={`flex flex-col justify-center whitespace-nowrap rounded-xl text-center text-white shadow-none transition-all duration-300 ${
            colorSwitcher[phase] ?? 'bg-indigo-200 dark:bg-indigo-300'
          }`}
        ></div>
      </div>
    </div>
  )
}
