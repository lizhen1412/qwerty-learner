import type { AmountType } from '../DonatingCard'
import { DonatingCard } from '../DonatingCard'
import { StickerButton } from '../DonatingCard/components/StickerButton'
import { useChapterNumber, useDayFromFirstWordRecord, useSumWrongCount, useWordNumber } from './hooks/useWordStats'
import { DONATE_DATE } from '@/constants'
import { reportDonateCard } from '@/utils'
import noop from '@/utils/noop'
import { Dialog, Transition } from '@headlessui/react'
import dayjs from 'dayjs'
import type React from 'react'
import { Fragment, useLayoutEffect, useMemo, useState } from 'react'
import IconParty from '~icons/logos/partytown-icon'

/**
 * 捐赠卡片组件
 * @returns 捐赠卡片组件
 */
export const DonateCard = () => {
  // 是否显示捐赠卡片
  const [show, setShow] = useState(false)
  // 捐赠金额
  const [amount, setAmount] = useState<AmountType | undefined>(undefined)

  // 章节数量
  const chapterNumber = useChapterNumber()
  // 单词数量
  const wordNumber = useWordNumber()
  // 总错误次数
  const sumWrongCount = useSumWrongCount()
  // 距离第一个单词记录的天数
  const dayFromFirstWord = useDayFromFirstWordRecord()
  // 距离 Qwerty 上线天数
  const dayFromQwerty = useMemo(() => {
    // 获取当前日期
    const now = dayjs()
    // 获取 Qwerty 上线日期
    const past = dayjs('2021-01-21')
    // 计算距离 Qwerty 上线天数
    return now.diff(past, 'day')
  }, [])

  /**
   * 高亮文本组件
   * @param param0
   * @returns
   */
  const HighlightedText = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    // 返回高亮文本组件
    return <span className={`font-bold  ${className ? className : 'text-indigo-500'}`}>{children}</span>
  }

  /**
   * 点击已捐赠按钮
   */
  const onClickHasDonated = () => {
    reportDonateCard({
      type: 'donate',
      chapterNumber,
      wordNumber,
      sumWrongCount,
      dayFromFirstWord,
      dayFromQwerty,
      amount: amount ?? 0,
    })

    // 设置显示状态为 false
    setShow(false)
    // 获取当前日期
    const now = dayjs()
    // 将当前日期存储到本地存储中
    window.localStorage.setItem(DONATE_DATE, now.format())
  }

  /**
   * 点击之后提醒我
   */
  const onClickRemindMeLater = () => {
    reportDonateCard({
      type: 'dismiss',
      chapterNumber,
      wordNumber,
      sumWrongCount,
      dayFromFirstWord,
      dayFromQwerty,
      amount: amount ?? 0,
    })

    // 设置显示状态为 false
    setShow(false)
  }

  /**
   * 捐赠金额变化
   * @param amount 捐赠金额
   */
  const onAmountChange = (amount: AmountType) => {
    setAmount(amount)
  }

  /**
   * 使用 useLayoutEffect 监听章节数量变化
   */
  useLayoutEffect(() => {
    // 如果章节数量大于 0 且是 10 的倍数
    if (chapterNumber && chapterNumber !== 0 && chapterNumber % 10 === 0) {
      // 获取本地存储中的捐赠日期
      const storedDate = window.localStorage.getItem(DONATE_DATE)
      // 将本地存储中的捐赠日期转换为 dayjs 对象
      const date = dayjs(storedDate)
      // 获取当前日期
      const now = dayjs()
      // 计算当前日期与捐赠日期之间的天数差
      const diff = now.diff(date, 'day')
      // 如果本地存储中的捐赠日期不存在或与当前日期相差大于 60 天
      if (!storedDate || diff > 60) {
        // 设置显示状态为 true
        setShow(true)
      }
    }
  }, [chapterNumber])

  /**
   * 返回捐赠卡片组件
   * @returns 捐赠卡片组件
   */
  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => {
          noop()
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative my-8 w-[37rem] transform select-text overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
                <div className="flex w-full flex-col justify-center gap-4 bg-white px-2 pb-4 pt-5 dark:bg-gray-800 dark:text-gray-300">
                  <h1 className="gradient-text w-full pt-3 text-center text-[2.4rem] font-bold">{`${chapterNumber} Chapters Achievement !`}</h1>
                  <div className="flex w-full flex-col gap-4 px-4">
                    <p className="mx-auto px-4 indent-4">
                      您刚刚完成了<HighlightedText> {chapterNumber} </HighlightedText>章节的练习，Qwerty Learner 已经陪你走过
                      <HighlightedText> {dayFromFirstWord} </HighlightedText> 天，一起完成了
                      <HighlightedText> {wordNumber} </HighlightedText>
                      词的练习，帮助您纠正了 <HighlightedText> {sumWrongCount} </HighlightedText>次错误输入，让我们一起为您的进步欢呼
                      <IconParty className="ml-2 inline-block" fontSize={16} />
                      <IconParty className="inline-block" fontSize={16} />
                      <IconParty className="inline-block" fontSize={16} />
                      <br />
                    </p>
                    <p className="mx-auto px-4 indent-4">
                      Qwerty Learner 已经坚持 <span className="font-medium ">开放源码、无广告、无商业化</span> 运营
                      <HighlightedText className="text-indigo-500"> {dayFromQwerty} </HighlightedText> 天，
                      我们的目标是为所有学习者提供一个高效、便捷、无干扰的学习环境。我们诚挚地邀请您考虑进行捐赠，捐赠将直接用于维持 Qwerty
                      的日常运营以及未来发展，让 Qwerty 与您一起成长。
                    </p>
                    <p className="mx-auto px-4 indent-4 ">
                      为了感谢您的慷慨，单次 50 rmb 及以上的捐赠， 我们将回赠 Qwerty 的定制贴纸 5 枚
                      <span className="text-xs">（仅限大陆地区）</span>，希望您可以跟朋友分享您的快乐
                    </p>
                    <div className="flex items-center justify-center">
                      <StickerButton />
                    </div>
                  </div>

                  <DonatingCard className="mt-2" onAmountChange={onAmountChange} />
                  <div className="flex w-full justify-between  px-14 pb-3 pt-0">
                    <button
                      type="button"
                      className={`my-btn-primary ${!amount && 'invisible'} w-36 bg-amber-500 font-medium transition-all`}
                      onClick={onClickHasDonated}
                    >
                      我已捐赠
                    </button>
                    <button type="button" className="my-btn-primary w-36 font-medium" onClick={onClickRemindMeLater}>
                      之后提醒我
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
