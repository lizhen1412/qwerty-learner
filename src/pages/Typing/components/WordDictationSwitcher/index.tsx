import { wordDictationConfigAtom } from '@/store'
import type { WordDictationType } from '@/typings'
import { Listbox, Popover, Switch, Transition } from '@headlessui/react'
import { useAtom } from 'jotai'
import { Fragment, useLayoutEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import IconEyeSlash from '~icons/heroicons/eye-slash-solid'
import IconEye from '~icons/heroicons/eye-solid'
import IconCheck from '~icons/tabler/check'
import IconChevronDown from '~icons/tabler/chevron-down'

/**
 * 单词默写类型列表
 * 用于显示单词默写类型
 */
const wordDictationTypeList: { name: string; type: WordDictationType }[] = [
  {
    name: '全部隐藏',
    type: 'hideAll',
  },
  {
    name: '隐藏元音',
    type: 'hideVowel',
  },
  {
    name: '隐藏辅音',
    type: 'hideConsonant',
  },
  {
    name: '随机隐藏',
    type: 'randomHide',
  },
]

/**
 * 单词默写开关
 * 用于切换单词默写模式
 * @returns 单词默写开关
 */
export default function WordDictationSwitcher() {
  const [wordDictationConfig, setWordDictationConfig] = useAtom(wordDictationConfigAtom)
  const [currentType, setCurrentType] = useState(wordDictationTypeList[0])

  /**
   * 切换单词听写模式的开关状态
   * - 当开启时记录是用户主动操作
   * - 保持其他配置项不变
   */
  const onToggleWordDictation = () => {
    // 如果单词听写模式关闭，则设置为开启，并记录是用户主动操作
    setWordDictationConfig((old) => {
      if (!old.isOpen) {
        return { ...old, isOpen: !old.isOpen, openBy: 'user' }
      } else {
        return { ...old, isOpen: !old.isOpen }
      }
    })
  }

  /**
   * 切换单词默写类型
   * @param value 单词默写类型
   */
  const onChangeWordDictationType = (value: WordDictationType) => {
    setWordDictationConfig((old) => {
      return { ...old, type: value }
    })
  }

  /**
   * 设置当前单词默写类型
   */
  useLayoutEffect(() => {
    setCurrentType(wordDictationTypeList.find((item) => item.type === wordDictationConfig.type) || wordDictationTypeList[0])
  }, [wordDictationConfig.type])

  /**
   * 使用热键
   */
  useHotkeys(
    'ctrl+v',
    () => {
      onToggleWordDictation()
    },
    { enableOnFormTags: true, preventDefault: true },
    [],
  )

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`flex items-center justify-center rounded p-[2px] text-lg ${
              wordDictationConfig.isOpen ? 'text-indigo-500' : 'text-gray-500'
            } outline-none transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white  ${
              open ? 'bg-indigo-500 text-white' : ''
            }`}
            type="button"
            aria-label="开关默写模式"
          >
            {wordDictationConfig.isOpen ? <IconEye className="icon" /> : <IconEyeSlash className="icon" />}
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
            <Popover.Panel className="absolute left-1/2 z-10 mt-2 flex max-w-max -translate-x-1/2 px-4 ">
              <div className="shadow-upper box-border flex w-60 select-none flex-col items-center justify-center gap-4 rounded-xl bg-white p-4 drop-shadow dark:bg-gray-800">
                <div className="flex w-full  flex-col  items-start gap-2 py-0">
                  <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">开关默写模式</span>
                  <div className="flex w-full flex-row items-center justify-between">
                    <Switch checked={wordDictationConfig.isOpen} onChange={onToggleWordDictation} className="switch-root">
                      <span aria-hidden="true" className="switch-thumb" />
                    </Switch>
                    <span className="text-right text-xs font-normal leading-tight text-gray-600">{`默写已${
                      wordDictationConfig.isOpen ? '开启' : '关闭'
                    }`}</span>
                  </div>
                </div>

                <Transition
                  show={wordDictationConfig.isOpen}
                  className="flex w-full flex-col items-center justify-center gap-4"
                  enter="transition-all duration-300 ease-in"
                  enterFrom="max-h-0 opacity-0"
                  enterTo="max-h-[300px] opacity-100"
                  leave="transition-all duration-300 ease-out"
                  leaveFrom="max-h-[300px] opacity-100"
                  leaveTo="max-h-0 opacity-0"
                >
                  <div className="flex w-full  flex-col  items-start gap-2 py-0">
                    <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">默写模式</span>
                    <div className="flex w-full flex-row items-center justify-between">
                      <Listbox value={currentType.type} onChange={onChangeWordDictationType}>
                        <div className="relative">
                          <Listbox.Button className="listbox-button">
                            <span>{currentType.name}</span>
                            <span>
                              <IconChevronDown className="focus:outline-none" />
                            </span>
                          </Listbox.Button>
                          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                            <Listbox.Options className="listbox-options">
                              {wordDictationTypeList.map((item) => (
                                <Listbox.Option key={item.name} value={item.type}>
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
                </Transition>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
