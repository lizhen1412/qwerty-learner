import { useEffect, useState } from 'react'

/**
 * 是否是客户端
 */
const isClient = typeof window === 'object'

/**
 * 使用窗口大小
 * @param initialWidth 初始宽度
 * @param initialHeight 初始高度
 */
const useWindowSize = (initialWidth = Infinity, initialHeight = Infinity) => {
  const [state, setState] = useState<{ width: number; height: number }>({
    width: isClient ? window.innerWidth : initialWidth,
    height: isClient ? window.innerHeight : initialHeight,
  })

  /**
   * 使用 useEffect 监听窗口大小
   */
  useEffect(() => {
    if (isClient) {
      // 如果是在客户端
      const handler = () => {
        // 监听窗口大小
        setState({
          width: window.innerWidth, // 窗口宽度
          height: window.innerHeight, // 窗口高度
        })
      }
      window.addEventListener('resize', handler) // 添加监听窗口大小
      return () => window.removeEventListener('resize', handler) // 移除监听窗口大小
    } else {
      return undefined // 如果不在客户端，则返回 undefined
    }
  }, [])

  /**
   * 返回窗口大小
   * @returns 窗口大小
   */
  return state
}

export default useWindowSize
