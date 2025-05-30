import { SoundIcon } from './SoundIcon'
import usePronunciationSound from '@/hooks/usePronunciation'
import type { Word } from '@/typings'
import { useCallback, useEffect, useImperativeHandle } from 'react'
import React from 'react'

/**
 * 单词发音图标
 * @param param0
 * @returns
 */
export const WordPronunciationIcon = React.forwardRef<
  WordPronunciationIconRef,
  { word: Word; lang: string; className?: string; iconClassName?: string }
>(({ word, lang, className, iconClassName }, ref) => {
  const currentWord = () => {
    if (lang === 'hapin') {
      if (/[\u0400-\u04FF]/.test(word.notation || '')) {
        // 哈萨克语西里尔文字
        return word.notation || ''
      } else {
        // 哈萨克语老文字
        return word.trans[2]
      }
    } else {
      return word.name
    }
  }
  // 发音
  const { play, stop, isPlaying } = usePronunciationSound(currentWord())

  /**
   * 播放声音
   */
  const playSound = useCallback(() => {
    stop()
    play()
  }, [play, stop])

  /**
   * 停止发音
   */
  useEffect(() => {
    return stop
  }, [word, stop])

  /**
   * 暴露发音方法
   */
  useImperativeHandle(
    ref,
    () => ({
      play: playSound,
    }),
    [playSound],
  )

  /**
   * 返回单词发音图标
   * @returns 单词发音图标
   */
  return (
    <SoundIcon
      animated={isPlaying}
      onClick={playSound}
      className={`cursor-pointer text-gray-600 ${className}`}
      iconClassName={iconClassName}
    />
  )
})

WordPronunciationIcon.displayName = 'WordPronunciationIcon'

/**
 * 单词发音图标引用
 */
export type WordPronunciationIconRef = {
  play: () => void
}
