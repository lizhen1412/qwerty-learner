/* eslint-disable react/prop-types */
import { cn } from '@/utils/ui'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as React from 'react'

/**
 * 工具提示提供者
 * @returns 工具提示提供者
 */
const TooltipProvider = TooltipPrimitive.Provider

/**
 * 工具提示
 * @returns 工具提示
 */
const Tooltip = TooltipPrimitive.Root

/**
 * 工具提示触发器
 * @returns 工具提示触发器
 */
const TooltipTrigger = TooltipPrimitive.Trigger

/**
 * 工具提示内容
 * @returns 工具提示内容
 */
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border border-slate-100 bg-white px-2 py-[4px] text-sm text-slate-700 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100',
      className,
    )}
    {...props}
  />
))
/**
 * 工具提示内容
 * @returns 工具提示内容
 */
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
