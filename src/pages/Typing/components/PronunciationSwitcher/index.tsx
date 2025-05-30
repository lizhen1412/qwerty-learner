import Tooltip from '@/components/Tooltip'
import { LANG_PRON_MAP } from '@/resources/soundResource'
import { currentDictInfoAtom, phoneticConfigAtom, pronunciationConfigAtom } from '@/store'
import type { PronunciationType } from '@/typings'
import { PRONUNCIATION_PHONETIC_MAP } from '@/typings'
import { CTRL } from '@/utils'
import { Listbox, Popover, Switch, Transition } from '@headlessui/react'
import { useAtom, useAtomValue } from 'jotai'
import { Fragment, useCallback, useEffect, useMemo } from 'react'
import IconCheck from '~icons/tabler/check'
import IconChevronDown from '~icons/tabler/chevron-down'

/**
 * 发音及音标切换器
 * 用于在单词学习界面中切换发音和音标
 * 支持发音开关、音标开关、释义发音开关、循环发音开关、单词发音口音切换
 * @returns 发音及音标切换器
 */
const PronunciationSwitcher = () => {
  /**
   * 当前词典信息
   */
  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  /**
   * 发音配置
   */
  const [pronunciationConfig, setPronunciationConfig] = useAtom(pronunciationConfigAtom)
  /**
   * 音标配置
   */
  const [phoneticConfig, setPhoneticConfig] = useAtom(phoneticConfigAtom)
  /**
   * 发音列表
   */
  const pronunciationList = useMemo(() => LANG_PRON_MAP[currentDictInfo.language].pronunciation, [currentDictInfo.language])

  /**
   * 默认发音
   */
  useEffect(() => {
    /**
     * 默认发音索引
     */
    const defaultPronIndex = currentDictInfo.defaultPronIndex || LANG_PRON_MAP[currentDictInfo.language].defaultPronIndex
    /**
     * 默认发音
     */
    const defaultPron = pronunciationList[defaultPronIndex]

    // if the current pronunciation is not in the pronunciation list, reset the pronunciation config to default
    const index = pronunciationList.findIndex((item) => item.pron === pronunciationConfig.type)
    // 如果当前发音不在发音列表中，则重置发音配置为默认发音
    if (index === -1) {
      // only change the type and name, keep the isOpen state
      setPronunciationConfig((old) => ({
        ...old, // 保持其他状态不变
        type: defaultPron.pron, // 设置默认发音
        name: defaultPron.name, // 设置默认发音名称
      }))
    }
  }, [currentDictInfo.defaultPronIndex, currentDictInfo.language, setPronunciationConfig, pronunciationList, pronunciationConfig.type])

  /**
   * 更新音标配置
   */
  useEffect(() => {
    /**
     * 获取音标类型
     */
    const phoneticType = PRONUNCIATION_PHONETIC_MAP[pronunciationConfig.type]
    if (phoneticType) {
      setPhoneticConfig((old) => ({
        // 设置音标配置
        ...old, // 保持其他状态不变
        type: phoneticType, // 设置音标类型
      }))
    }
  }, [pronunciationConfig.type, setPhoneticConfig])

  /**
   * 更新发音配置
   */
  const onChangePronunciationIsOpen = useCallback(
    (value: boolean) => {
      setPronunciationConfig((old) => ({
        // 设置发音配置
        ...old, // 保持其他状态不变
        isOpen: value, // 设置发音开关
      }))
    },
    [setPronunciationConfig],
  )

  /**
   * 更新释义发音配置
   */
  const onChangePronunciationIsTransRead = useCallback(
    (value: boolean) => {
      setPronunciationConfig((old) => ({
        // 设置发音配置
        ...old, // 保持其他状态不变
        isTransRead: value, // 设置释义发音开关
      }))
    },
    [setPronunciationConfig],
  )

  /**
   * 更新循环发音配置
   */
  const onChangePronunciationIsLoop = useCallback(
    (value: boolean) => {
      setPronunciationConfig((old) => ({
        // 设置发音配置
        ...old, // 保持其他状态不变
        isLoop: value, // 设置循环发音开关
      }))
    },
    [setPronunciationConfig],
  )

  /**
   * 更新音标开关
   */
  const onChangePhoneticIsOpen = useCallback(
    (value: boolean) => {
      setPhoneticConfig((old) => ({
        // 设置音标配置
        ...old, // 保持其他状态不变
        isOpen: value, // 设置音标开关
      }))
    },
    [setPhoneticConfig],
  )

  /**
   * 更新发音类型
   */
  const onChangePronunciationType = useCallback(
    (value: PronunciationType) => {
      /**
       * 获取发音类型
       */
      const item = pronunciationList.find((item) => item.pron === value)
      // 如果发音类型存在，则更新发音配置
      if (item) {
        setPronunciationConfig((old) => ({
          // 设置发音配置
          ...old, // 保持其他状态不变
          type: item.pron, // 设置发音类型
          name: item.name, // 设置发音名称
        }))
      }
    },
    [setPronunciationConfig, pronunciationList],
  )

  /**
   * 当前发音标签
   */
  const currentLabel = useMemo(() => {
    // 如果发音开关开启，则返回发音名称
    if (pronunciationConfig.isOpen) {
      return pronunciationConfig.name // 返回发音名称
    } else {
      return '关闭' // 返回关闭
    }
  }, [pronunciationConfig.isOpen, pronunciationConfig.name])

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`flex h-8 min-w-max cursor-pointer items-center justify-center rounded-md px-1 transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100  ${
              open ? 'bg-indigo-400 text-white' : 'bg-transparent'
            }`}
            onFocus={(e) => {
              e.target.blur()
            }}
          >
            <Tooltip content="发音及音标切换">{currentLabel}</Tooltip>
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-20 mt-2 flex max-w-max -translate-x-1/2 px-4 ">
              <div className="shadow-upper box-border flex w-60 select-none flex-col items-center justify-center gap-4 rounded-xl bg-white p-4 drop-shadow transition duration-1000 ease-in-out dark:bg-gray-800">
                <div className="flex w-full  flex-col  items-start gap-2 py-0">
                  <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">开关音标显示</span>
                  <div className="flex w-full flex-row items-center justify-between">
                    <Switch checked={phoneticConfig.isOpen} onChange={onChangePhoneticIsOpen} className="switch-root">
                      <span aria-hidden="true" className="switch-thumb" />
                    </Switch>
                    <span className="text-right text-xs font-normal leading-tight text-gray-600">{`音标已${
                      phoneticConfig.isOpen ? '开启' : '关闭'
                    }`}</span>
                  </div>
                </div>
                <div className="flex w-full  flex-col  items-start gap-2 py-0">
                  <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">开关单词发音</span>
                  <div className="flex w-full flex-row items-center justify-between">
                    <Switch checked={pronunciationConfig.isOpen} onChange={onChangePronunciationIsOpen} className="switch-root">
                      <span aria-hidden="true" className="switch-thumb" />
                    </Switch>
                    <span className="text-right text-xs font-normal leading-tight text-gray-600">{`发音已${
                      pronunciationConfig.isOpen ? '开启' : '关闭'
                    }`}</span>
                  </div>
                </div>
                {window.speechSynthesis && (
                  <div className="flex w-full  flex-col  items-start gap-2 py-0">
                    <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">开关释义发音</span>
                    <div className="flex w-full flex-row items-center justify-between">
                      <Switch checked={pronunciationConfig.isTransRead} onChange={onChangePronunciationIsTransRead} className="switch-root">
                        <span aria-hidden="true" className="switch-thumb" />
                      </Switch>
                      <span className="text-right text-xs font-normal leading-tight text-gray-600">{`发音已${
                        pronunciationConfig.isTransRead ? '开启' : '关闭'
                      }`}</span>
                    </div>
                  </div>
                )}
                <Transition
                  show={pronunciationConfig.isOpen}
                  className="flex w-full flex-col items-center justify-center gap-4"
                  enter="transition-all duration-300 ease-in"
                  enterFrom="max-h-0 opacity-0"
                  enterTo="max-h-[300px] opacity-100"
                  leave="transition-all duration-300 ease-out"
                  leaveFrom="max-h-[300px] opacity-100"
                  leaveTo="max-h-0 opacity-0"
                >
                  <div className="flex w-full  flex-col  items-start gap-2 py-0">
                    <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">开关循环发音</span>
                    <div className="flex w-full flex-row items-center justify-between">
                      <Switch checked={pronunciationConfig.isLoop} onChange={onChangePronunciationIsLoop} className="switch-root">
                        <span aria-hidden="true" className="switch-thumb" />
                      </Switch>
                      <span className="text-right text-xs font-normal leading-tight text-gray-600">{`循环已${
                        pronunciationConfig.isLoop ? '开启' : '关闭'
                      }`}</span>
                    </div>
                  </div>
                  <div className="flex w-full  flex-col  items-start gap-2 py-0">
                    <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">单词发音口音</span>
                    <div className="flex w-full flex-row items-center justify-between">
                      <Listbox value={pronunciationConfig.type} onChange={onChangePronunciationType}>
                        <div className="relative">
                          <Listbox.Button className="listbox-button">
                            <span>{pronunciationConfig.name}</span>
                            <span>
                              <IconChevronDown className="focus:outline-none" />
                            </span>
                          </Listbox.Button>
                          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="listbox-options">
                              {pronunciationList.map((item) => (
                                <Listbox.Option key={item.pron} value={item.pron}>
                                  {({ selected }) => (
                                    <>
                                      <span>{item.name}</span>
                                      {selected ? (
                                        <span className="listbox-options-icon">
                                          <IconCheck className="focus:outline-none" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </Listbox>
                    </div>
                  </div>
                  {pronunciationConfig.isOpen && (
                    <span className="text-colo text-xs font-medium text-gray-500 dark:text-white dark:text-opacity-60">
                      Tips: 朗读发音快捷键（{CTRL} + J）
                    </span>
                  )}
                </Transition>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

export default PronunciationSwitcher
