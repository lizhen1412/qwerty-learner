import type { WordUpdateAction } from '../InputHandler'
import { TypingContext } from '@/pages/Typing/store'
import type { FormEvent } from 'react'
import { useCallback, useContext, useEffect, useRef } from 'react'

/**
 * 文本区域处理
 * 用于处理文本区域
 * @param updateInput 更新输入
 * @returns 文本区域处理
 */
export default function TextAreaHandler({ updateInput }: { updateInput: (updateObj: WordUpdateAction) => void }) {
  /**
   * 文本区域引用
   */
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  /**
   * 打字上下文
   */
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!

  /**
   * 使用效果
   */
  useEffect(() => {
    if (!textareaRef.current) return

    /**
     * 如果打字状态为开启，则聚焦文本区域
     */
    if (state.isTyping) {
      // 聚焦文本区域
      textareaRef.current.focus()
    } else {
      // 失焦文本区域
      textareaRef.current.blur()
    }
  }, [state.isTyping])

  /**
   * 输入事件
   * @param e 事件
   */
  const onInput = (e: FormEvent<HTMLTextAreaElement>) => {
    const nativeEvent = e.nativeEvent as InputEvent

    /**
     * 如果输入事件不是组合事件，并且数据不为空，则更新输入
     */
    if (!nativeEvent.isComposing && nativeEvent.data !== null) {
      // 更新输入
      updateInput({ type: 'add', value: nativeEvent.data, event: e })

      // 清空文本区域
      if (textareaRef.current) {
        textareaRef.current.value = ''
      }
    }
  }

  /**
   * 失焦事件
   */
  const onBlur = useCallback(() => {
    if (!textareaRef.current) return

    /**
     * 如果打字状态为开启，则聚焦文本区域
     */
    if (state.isTyping) {
      textareaRef.current.focus()
    }
  }, [state.isTyping])

  return (
    <textarea
      className="absolute left-0 top-0 m-0 h-0 w-0 appearance-none overflow-hidden border-0 p-0 focus:outline-none"
      ref={textareaRef}
      autoFocus
      spellCheck="false"
      onInput={onInput}
      onBlur={onBlur}
      onCompositionStart={() => {
        alert('您正在使用输入法，请关闭输入法。')
      }}
    ></textarea>
  )
}
