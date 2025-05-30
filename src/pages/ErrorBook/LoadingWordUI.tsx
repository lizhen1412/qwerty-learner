import { LoadingUI } from '@/components/Loading'
import type { FC } from 'react'
import ErrorIcon from '~icons/ic/outline-error'

/**
 * 加载单词 UI 属性
 */
type LoadingWordUIProps = {
  className?: string // 类名
  isLoading: boolean // 是否加载中
  hasError: boolean // 是否加载失败
}

/**
 * 加载单词 UI
 * @param param0
 * @returns
 */
export const LoadingWordUI: FC<LoadingWordUIProps> = ({ className, isLoading, hasError }) => {
  /**
   * 返回加载单词 UI
   * @returns 加载单词 UI
   */
  return (
    <div className={`${className}`}>
      {hasError ? (
        <div className="tooltip !bg-transparent" data-tip="数据加载失败">
          <ErrorIcon className="text-red-500" />
        </div>
      ) : (
        isLoading && <LoadingUI />
      )}
    </div>
  )
}
