import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

/**
 * source: https://usehooks-ts.com/react-hook/use-intersection-observer
 */
interface Args extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

/**
 * 使用交叉观察器
 * @param elementRef 元素引用
 * @param threshold 阈值
 * @param root 根元素
 * @param rootMargin 根元素边距
 * @param freezeOnceVisible 冻结一次可见
 */
function useIntersectionObserver(
  elementRef: RefObject<Element>,
  { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false }: Args,
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>()

  // 冻结一次可见
  const frozen = entry?.isIntersecting && freezeOnceVisible

  /**
   * 更新条目
   * @param entry 条目
   */
  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry)
  }

  /**
   * 使用 useEffect 监听交叉观察器
   */
  useEffect(() => {
    const node = elementRef?.current // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver

    if (!hasIOSupport || frozen || !node) return

    const observerParams = { threshold, root, rootMargin }
    const observer = new IntersectionObserver(updateEntry, observerParams)

    observer.observe(node)

    return () => observer.disconnect()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementRef?.current, JSON.stringify(threshold), root, rootMargin, frozen])

  return entry
}

export default useIntersectionObserver
