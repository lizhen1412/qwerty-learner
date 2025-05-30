import { CONFETTI_DEFAULTS } from '@/constants'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

/**
 * 使用烟花效果
 * @param state 是否显示烟花效果
 */
export function useConfetti(state: boolean) {
  /**
   * 使用烟花效果
   */
  useEffect(() => {
    let leftConfettiTimer: number | undefined // 左烟花定时器
    let rightConfettiTimer: number | undefined // 右烟花定时器

    // 如果需要显示烟花效果
    if (state) {
      // 设置左烟花定时器
      leftConfettiTimer = window.setTimeout(() => {
        confetti({
          ...CONFETTI_DEFAULTS,
          particleCount: 50,
          angle: 60,
          spread: 100,
          origin: { x: 0 },
        })
      }, 250)

      // 设置右烟花定时器
      rightConfettiTimer = window.setTimeout(() => {
        confetti({
          ...CONFETTI_DEFAULTS,
          particleCount: 50,
          angle: 120,
          spread: 100,
          origin: { x: 1 },
        })
      }, 400)
    }

    // 清除定时器
    return () => {
      window.clearTimeout(leftConfettiTimer)
      window.clearTimeout(rightConfettiTimer)
    }
  }, [state])
}
