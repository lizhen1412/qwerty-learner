import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 智能合并CSS类名工具函数
 * @param {...ClassValue[]} inputs - 可接收多个类名参数，支持多种格式：
 *   - 字符串类名
 *   - 对象形式{ [className]: boolean }
 *   - 数组形式
 *   - 嵌套结构
 * @returns {string} 合并优化后的类名字符串
 *
 * 功能特点:
 * 1. 使用clsx处理各种类名输入格式
 * 2. 使用twMerge合并Tailwind类名冲突
 * 3. 自动去除重复和无效类名
 * 4. 保留Tailwind类名的正确顺序
 *
 * 使用示例:
 * cn('p-2', 'p-4') → 'p-4'
 * cn('text-red', { 'text-blue': true }) → 'text-blue'
 * cn(['p-2', 'm-2'], 'p-4') → 'm-2 p-4'
 */
export function cn(...inputs: ClassValue[]) {
  // 1. 先用clsx处理各种类名输入格式
  // 2. 再用twMerge处理Tailwind类名冲突
  return twMerge(clsx(inputs))
}
