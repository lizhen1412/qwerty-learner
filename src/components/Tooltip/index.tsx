import { classNames } from '@/utils'
import type { ReactNode } from 'react'
import { useState } from 'react'

/**
 * 工具提示组件
 * @param param0
 * @returns
 */
const Tooltip = ({ children, content, className, placement = 'top' }: TooltipProps) => {
  const [visible, setVisible] = useState(false)

  /**
   * 位置类名
   */
  const placementClasses = {
    top: 'bottom-full pb-2',
    bottom: 'top-full pt-2',
  }[placement]

  /**
   * 返回工具提示组件
   * @returns 工具提示组件
   */
  return (
    <div className={classNames('relative', className)}>
      <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)} onBlur={() => setVisible(false)}>
        {children}
      </div>
      <div
        className={`${
          visible ? 'opacity-100' : 'opacity-0'
        } ${placementClasses} pointer-events-none absolute left-1/2 flex -translate-x-1/2 transform items-center justify-center transition-opacity`}
      >
        <span className="tooltip">{content}</span>
      </div>
    </div>
  )
}

/**
 * 工具提示属性
 */
export type TooltipProps = {
  children: ReactNode
  /** 显示文本 */
  content: string
  /** 位置 */
  placement?: 'top' | 'bottom'
  className?: string
}

export default Tooltip
