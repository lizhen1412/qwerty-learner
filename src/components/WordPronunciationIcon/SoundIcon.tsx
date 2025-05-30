import { VolumeHighIcon, VolumeIcon, VolumeLowIcon, VolumeMediumIcon } from './VolumeIcon'
import type { MouseEventHandler } from 'react'
import { useEffect, useState } from 'react'

/**
 * 音量图标
 */
const volumeIcons = [VolumeIcon, VolumeLowIcon, VolumeMediumIcon, VolumeHighIcon]

/**
 * 音量图标
 */
export const SoundIcon = ({ duration = 500, animated = false, onClick, iconClassName, className }: SoundIconProps) => {
  const [animationFrameIndex, setAnimationFrameIndex] = useState(0)

  /**
   * 使用 useEffect 监听动画
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const index = animated ? (animationFrameIndex < volumeIcons.length - 1 ? animationFrameIndex + 1 : 0) : 0

      setAnimationFrameIndex(index)
    }, duration)

    return () => {
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animated, animationFrameIndex])

  // 音量图标
  const Icon = volumeIcons[animationFrameIndex]

  /**
   * 返回音量图标
   * @returns 音量图标
   */
  return (
    <button type="button" className={`focus:outline-none dark:fill-gray-400 dark:opacity-80 ${className}`} onClick={onClick}>
      <Icon className={iconClassName} />
    </button>
  )
}

/**
 * 音量图标属性
 */
export type SoundIconProps = {
  animated?: boolean
  duration?: number
  onClick?: MouseEventHandler<HTMLButtonElement>
  iconClassName?: string
  className?: string
}
