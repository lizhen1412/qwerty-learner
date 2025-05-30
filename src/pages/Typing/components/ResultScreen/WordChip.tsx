import usePronunciationSound from '@/hooks/usePronunciation'
import type { WordWithIndex } from '@/typings'
import { flip, offset, shift, useFloating, useHover, useInteractions, useRole } from '@floating-ui/react'
import { useCallback, useState } from 'react'

/**
 * 单词芯片
 * 用于显示单词和释义
 * @param param0 单词芯片的属性
 * @returns 单词芯片
 */
export default function WordChip({ word }: { word: WordWithIndex }) {
  /**
   * 是否显示释义
   */
  const [showTranslation, setShowTranslation] = useState(false)
  /**
   * 使用浮动
   */
  const { x, y, strategy, refs, context } = useFloating({
    /**
     * 是否显示释义
     */
    open: showTranslation,
    /**
     * 设置是否显示释义
     */
    onOpenChange: setShowTranslation,
    middleware: [offset(4), shift(), flip()], // 中间件
  })
  /**
   * 使用悬停
   */
  const hover = useHover(context)
  /**
   * 使用角色
   */
  const role = useRole(context, { role: 'tooltip' })
  /**
   * 使用交互
   */
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, role])
  /**
   * 使用发音
   */
  const { play, stop } = usePronunciationSound(word.name, false)

  /**
   * 点击单词
   */
  const onClickWord = useCallback(() => {
    stop() // 停止发音
    play() // 播放发音
  }, [play, stop])

  return (
    <>
      <button
        ref={refs.setReference}
        className="word-chip select-all"
        {...getReferenceProps()}
        type="button"
        onClick={onClickWord}
        title={`朗读 ${word.name}`}
      >
        <span>{word.name}</span>
      </button>
      {showTranslation && (
        <div
          ref={refs.setFloating}
          className="word-chip-tooltip"
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: 'max-content',
          }}
          {...getFloatingProps()}
        >
          {word.trans}
        </div>
      )}
    </>
  )
}
