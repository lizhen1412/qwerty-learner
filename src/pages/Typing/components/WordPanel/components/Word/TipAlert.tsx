import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { FC } from 'react'
import { useCallback } from 'react'
import PhWarning from '~icons/ph/warning'

// 定义组件的props类型
export type ITipAlert = {
  className?: string // 可选的CSS类名
  show: boolean // 控制警告框是否显示
  setShow: (show: boolean) => void // 控制显示状态的setter函数
}

/**
 * 提示警告框组件
 * 当检测到插件冲突时显示警告信息，用户可以点击关闭
 */
export const TipAlert: FC<ITipAlert> = ({ className, show, setShow }) => {
  // 关闭警告框的回调函数，使用useCallback优化性能
  const onClose = useCallback(() => {
    setShow(false) // 调用setShow将show状态设为false
  }, [setShow]) // 依赖项为setShow

  return (
    <>
      {show && (
        <div className={`alert z-10 w-fit cursor-pointer pr-5 ${className}`} onClick={onClose}>
          <Alert variant="destructive" className="relative">
            <PhWarning className="h-4 w-4" />
            <AlertTitle>插件冲突！</AlertTitle>
            <AlertDescription>如果多次输入失败，可能是与本地浏览器插件冲突，请关闭相关插件或切换浏览器试试</AlertDescription>
          </Alert>
        </div>
      )}
    </>
  )
}
