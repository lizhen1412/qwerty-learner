import { useCallback, useEffect, useState } from 'react'

/**
 * 使用语音合成 API 结果
 */
export type UseSpeechResult = {
  /**
   * Speak speaking
   * @param {boolean} [abort=false] Whether to cancel other speak
   */
  speak: (abort?: boolean) => void
  /**
   * Cancel speaking
   */
  cancel: () => void
  /**
   * Whether currently speaking
   */
  speaking: boolean
}

/**
 * React hook for using the SpeechSynthesis API.
 * @param {string} text The text to be spoken.
 * @param {Partial<SpeechSynthesisUtterance>} option SpeechSynthesisUtterance API option. {@link https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance#instance_properties}
 * @returns {Object} An object containing `speak`, `cancel` methods and `speaking` state.
 * @throws {Error} If browser not support SpeechSynthesis API.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API}
 */
export default function useSpeech(text: string, option?: Partial<SpeechSynthesisUtterance>): UseSpeechResult {
  const [speaking, setSpeaking] = useState(false)
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  /**
   * 使用 useEffect 监听语音合成 API
   */
  useEffect(() => {
    const synth = window.speechSynthesis // 获取语音合成 API
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined') {
      // 如果语音合成 API 不存在或者 SpeechSynthesisUtterance 不存在
      console.error('SpeechSynthesis API is not supported in this browser') // 抛出错误
      return
    }

    const newUtterance = new SpeechSynthesisUtterance(text) // 创建新的 utterance
    Object.assign(newUtterance, option) // 合并 option
    setUtterance(newUtterance) // 设置 utterance

    return () => {
      synth.cancel() // 取消说话
      setSpeaking(false) // 设置说话状态为 false
    }
  }, [option, text])

  /**
   * 使用 useEffect 监听语音合成 API
   */
  useEffect(() => {
    if (utterance) {
      // 如果 utterance 存在
      const onend = () => {
        // 监听结束
        setSpeaking(false) // 设置说话状态为 false
      }
      utterance.addEventListener('end', onend) // 添加监听结束
      return () => {
        utterance.removeEventListener('end', onend) // 移除监听结束
      }
    }
  }, [utterance])

  /**
   * 使用 useCallback 监听语音合成 API
   */
  const speak = useCallback(
    /**
     * 使用 useCallback 监听语音合成 API
     * @param abort 是否取消
     */
    (abort = false) => {
      if (utterance) {
        // 如果 utterance 存在
        const synth = window.speechSynthesis // 获取语音合成 API
        if (abort && synth.speaking) {
          // 如果需要取消并且正在说话
          synth.cancel() // 取消说话
        }
        setSpeaking(true) // 设置说话状态为 true
        synth.speak(utterance) // 说话
      }
    },
    [utterance],
  )

  /**
   * 使用 useCallback 监听语音合成 API
   */
  const cancel = useCallback(() => {
    const synth = window.speechSynthesis // 获取语音合成 API
    if (speaking) {
      // 如果正在说话
      synth.cancel() // 取消说话
    }
  }, [speaking])

  /**
   * 返回语音合成 API 结果
   * @returns 语音合成 API 结果
   */
  return {
    speak,
    cancel,
    speaking,
  }
}
