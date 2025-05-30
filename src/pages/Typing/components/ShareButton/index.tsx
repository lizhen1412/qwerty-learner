import SharePicDialog from './SharePicDialog'
import { recordShareAction } from '@/utils'
import { useCallback, useMemo, useState } from 'react'
import IconShare2 from '~icons/tabler/share-2'

/**
 * 分享按钮
 * 用于分享打字练习的成绩
 * @returns 分享按钮
 */
export default function ShareButton() {
  /**
   * 是否显示分享面板
   */
  const [isShowSharePanel, setIsShowSharePanel] = useState(false)

  /**
   * 随机选择
   */
  const randomChoose = useMemo(
    () => ({
      picRandom: Math.random(), // 随机选择图片
      promoteRandom: Math.random(), // 随机选择推广
    }),
    [],
  )

  /**
   * 点击分享
   */
  const onClickShare = useCallback(() => {
    recordShareAction('open') // 记录分享动作
    setIsShowSharePanel(true) // 设置是否显示分享面板
  }, [])

  return (
    <>
      {isShowSharePanel && <SharePicDialog showState={isShowSharePanel} setShowState={setIsShowSharePanel} randomChoose={randomChoose} />}

      <button
        type="button"
        className="cursor-pointer text-xl text-gray-500 hover:text-indigo-400"
        onClick={onClickShare}
        title="分享你的成绩给朋友"
      >
        <IconShare2 />
      </button>
    </>
  )
}
