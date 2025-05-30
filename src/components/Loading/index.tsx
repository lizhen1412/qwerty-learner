import React from 'react'

/**
 * 加载UI
 * @param param0
 * @returns
 */
export const LoadingUI: React.FC<{ className?: string }> = ({ className }) => {
  /**
   * 返回加载UI
   * @returns 加载UI
   */
  return (
    <div
      className={`inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid  border-indigo-400 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
      role="status"
    ></div>
  )
}

/**
 * 加载组件
 * @returns 加载组件
 */
const Loading: React.FC = () => {
  /**
   * 返回加载组件
   * @returns 加载组件
   */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf9ff;]">
      <div className="flex flex-col items-center justify-center ">
        <LoadingUI />
      </div>
    </div>
  )
}

export default React.memo(Loading)
