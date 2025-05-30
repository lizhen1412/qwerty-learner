import Tooltip from '@/components/Tooltip'
import { SoundIcon } from '@/components/WordPronunciationIcon/SoundIcon'
import useSpeech from '@/hooks/useSpeech'
import { fontSizeConfigAtom, isTextSelectableAtom, pronunciationConfigAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { useCallback, useMemo } from 'react'

/**
 * 翻译
 * 用于显示翻译
 * @param trans 翻译
 * @param showTrans 是否显示翻译
 * @param onMouseEnter 鼠标进入事件
 * @param onMouseLeave 鼠标离开事件
 */
export type TranslationProps = {
  trans: string // 翻译
  showTrans?: boolean // 是否显示翻译
  onMouseEnter?: () => void // 鼠标进入事件
  onMouseLeave?: () => void // 鼠标离开事件
}

/**
 * 翻译
 * 用于显示翻译
 * @param trans 翻译
 * @param showTrans 是否显示翻译
 * @param onMouseEnter 鼠标进入事件
 * @param onMouseLeave 鼠标离开事件
 * @returns 翻译
 */
export default function Translation({ trans, showTrans = true, onMouseEnter, onMouseLeave }: TranslationProps) {
  /**
   * 发音配置
   */
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom)
  /**
   * 字体大小配置
   */
  const fontSizeConfig = useAtomValue(fontSizeConfigAtom)
  /**
   * 是否显示翻译朗读
   */
  const isShowTransRead = window.speechSynthesis && pronunciationConfig.isTransRead
  /**
   * 语音选项
   */
  const speechOptions = useMemo(() => ({ volume: pronunciationConfig.transVolume }), [pronunciationConfig.transVolume])
  /**
   * 语音
   */
  const { speak, speaking } = useSpeech(trans, speechOptions)

  /**
   * 点击朗读释义
   */
  const handleClickSoundIcon = useCallback(() => {
    speak(true)
  }, [speak])

  /**
   * 是否可选择文本
   */
  const isTextSelectable = useAtomValue(isTextSelectableAtom)

  /**
   * 返回翻译
   */
  return (
    <div className={`flex items-center justify-center  pb-4 pt-5`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <span
        className={`max-w-4xl text-center font-sans transition-colors duration-300 dark:text-white dark:text-opacity-80 ${
          isShowTransRead && 'pl-8'
        } ${isTextSelectable && 'select-text'}`}
        style={{ fontSize: fontSizeConfig.translateFont.toString() + 'px' }}
      >
        {showTrans ? trans : '\u00A0'}
      </span>
      {isShowTransRead && showTrans && (
        <Tooltip content="朗读释义" className="ml-3 h-5 w-5 cursor-pointer leading-7">
          <SoundIcon animated={speaking} onClick={handleClickSoundIcon} className="h-5 w-5" />
        </Tooltip>
      )}
    </div>
  )
}
