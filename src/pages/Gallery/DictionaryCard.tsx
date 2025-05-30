import { currentChapterAtom, currentDictIdAtom } from '@/store'
import type { Dictionary } from '@/typings'
import { useAtom, useSetAtom } from 'jotai'
import type React from 'react'
import { useEffect, useRef } from 'react'
import IconCheckCircle from '~icons/heroicons/check-circle-solid'

/**
 * 词典卡片
 * @param param0
 * @returns
 */
const DictionaryCard: React.FC<DictionaryCardProps> = ({ dictionary }) => {
  /**
   * 按钮引用
   */
  const buttonRef = useRef<HTMLButtonElement>(null)
  /**
   * 当前词典 ID
   */
  const [currentDictId, setCurrentDictId] = useAtom(currentDictIdAtom)
  /**
   * 设置当前章节
   */
  const setCurrentChapter = useSetAtom(currentChapterAtom)
  useEffect(() => {
    /**
     * 如果当前词典 ID 和词典 ID 相同且按钮引用不为空，则滚动到按钮
     */
    if (currentDictId === dictionary.id && buttonRef.current !== null) {
      /**
       * 按钮
       */
      const button = buttonRef.current
      /**
       * 容器
       */
      const container = button.parentElement?.parentElement?.parentElement
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
  }, [])

  /**
   * 返回词典卡片
   * @returns 词典卡片
   */
  return (
    <button
      ref={buttonRef}
      className="relative w-48 overflow-hidden rounded-md border border-gray-300 bg-gray-50 p-4 text-left shadow-lg focus:outline-none dark:border-gray-500 dark:bg-gray-700 dark:bg-opacity-10 "
      type="button"
      onClick={() => {
        setCurrentDictId(dictionary.id)
        setCurrentChapter(0)
      }}
      title="选择词典"
    >
      <p className="mb-1 text-xl text-gray-800 dark:text-white dark:text-opacity-80">{dictionary.name}</p>
      <p className="mb-1 text-xs text-gray-900 dark:text-white dark:text-opacity-90">{dictionary.description}</p>
      <p className="text-sm font-bold text-gray-600 dark:text-white dark:text-opacity-60">{dictionary.length} 词</p>
      {currentDictId === dictionary.id ? (
        <IconCheckCircle className="absolute -bottom-4 -right-4 h-18 w-18 text-6xl text-green-500 opacity-60 dark:text-green-300" />
      ) : null}
    </button>
  )
}

/**
 * 词典卡片显示名称
 */
DictionaryCard.displayName = 'DictionaryCard'

/**
 * 词典卡片属性
 */
export type DictionaryCardProps = {
  dictionary: Dictionary // 词典
}

export default DictionaryCard
