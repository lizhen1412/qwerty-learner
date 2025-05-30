import React from 'react'

/**
 * 信息框
 * 用于显示打字练习的信息
 * @param info 信息
 * @param description 描述
 * @returns 信息框
 */
const InfoBox: React.FC<InfoBoxProps> = ({ info, description }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <span className="w-4/5 border-b pb-2 text-center text-xl font-bold text-gray-600 transition-colors duration-300 dark:text-gray-400">
        {info}
      </span>
      <span className="pt-2 text-xs transition-colors duration-300 dark:text-gray-300">{description}</span>
    </div>
  )
}

/**
 * 信息框
 * 用于显示打字练习的信息
 * @param info 信息
 * @param description 描述
 * @returns 信息框
 */
export default React.memo(InfoBox)

/**
 * 信息框属性
 * 用于显示打字练习的信息
 * @param info 信息
 * @param description 描述
 * @returns 信息框属性
 */
export type InfoBoxProps = {
  /**
   * 信息
   */
  info: string
  /**
   * 描述
   */
  description: string
}
