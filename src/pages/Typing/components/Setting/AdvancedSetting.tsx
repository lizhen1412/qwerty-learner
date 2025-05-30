import styles from './index.module.css'
import { isIgnoreCaseAtom, isShowAnswerOnHoverAtom, isShowPrevAndNextWordAtom, isTextSelectableAtom, randomConfigAtom } from '@/store'
import { Switch } from '@headlessui/react'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { useAtom } from 'jotai'
import { useCallback } from 'react'

/**
 * 高级设置
 * 用于设置打字练习的选项
 * @returns 高级设置
 */
export default function AdvancedSetting() {
  /**
   * 随机配置
   */
  const [randomConfig, setRandomConfig] = useAtom(randomConfigAtom)
  /**
   * 是否展示上一个/下一个单词
   */
  const [isShowPrevAndNextWord, setIsShowPrevAndNextWord] = useAtom(isShowPrevAndNextWordAtom)
  /**
   * 是否忽略大小写
   */
  const [isIgnoreCase, setIsIgnoreCase] = useAtom(isIgnoreCaseAtom)
  /**
   * 是否允许选择文本
   */
  const [isTextSelectable, setIsTextSelectable] = useAtom(isTextSelectableAtom)
  /**
   * 是否允许在悬停时显示答案
   */
  const [isShowAnswerOnHover, setIsShowAnswerOnHover] = useAtom(isShowAnswerOnHoverAtom)

  /**
   * 切换随机配置
   */
  const onToggleRandom = useCallback(
    /**
     * 切换随机配置
     */
    (checked: boolean) => {
      /**
       * 设置随机配置
       */
      setRandomConfig((prev) => ({
        ...prev, // 设置随机配置
        isOpen: checked, // 设置随机配置
      }))
    },
    [setRandomConfig],
  )

  /**
   * 切换上一个/下一个单词
   */
  const onToggleLastAndNextWord = useCallback(
    /**
     * 切换上一个/下一个单词
     */
    (checked: boolean) => {
      setIsShowPrevAndNextWord(checked) // 设置上一个/下一个单词
    },
    [setIsShowPrevAndNextWord],
  )

  /**
   * 切换忽略大小写
   */
  const onToggleIgnoreCase = useCallback(
    /**
     * 切换忽略大小写
     */
    (checked: boolean) => {
      setIsIgnoreCase(checked) // 设置忽略大小写
    },
    [setIsIgnoreCase],
  )

  /**
   * 切换选择文本
   */
  const onToggleTextSelectable = useCallback(
    /**
     * 切换选择文本
     */
    (checked: boolean) => {
      setIsTextSelectable(checked) // 设置选择文本
    },
    [setIsTextSelectable],
  )

  /**
   * 切换显示答案
   */
  const onToggleShowAnswerOnHover = useCallback(
    /**
     * 切换显示答案
     */
    (checked: boolean) => {
      setIsShowAnswerOnHover(checked) // 设置显示答案
    },
    [setIsShowAnswerOnHover],
  )

  return (
    <ScrollArea.Root className="flex-1 select-none overflow-y-auto ">
      <ScrollArea.Viewport className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>章节乱序</span>
            <span className={styles.sectionDescription}>开启后，每次练习章节中单词会随机排序。下一章节生效</span>
            <div className={styles.switchBlock}>
              <Switch checked={randomConfig.isOpen} onChange={onToggleRandom} className="switch-root">
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`随机已${
                randomConfig.isOpen ? '开启' : '关闭'
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>练习时展示上一个/下一个单词</span>
            <span className={styles.sectionDescription}>开启后，练习中会在上方展示上一个/下一个单词</span>
            <div className={styles.switchBlock}>
              <Switch checked={isShowPrevAndNextWord} onChange={onToggleLastAndNextWord} className="switch-root">
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`展示单词已${
                isShowPrevAndNextWord ? '开启' : '关闭'
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>是否忽略大小写</span>
            <span className={styles.sectionDescription}>开启后，输入时不区分大小写，如输入“hello”和“Hello”都会被认为是正确的</span>
            <div className={styles.switchBlock}>
              <Switch checked={isIgnoreCase} onChange={onToggleIgnoreCase} className="switch-root">
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`忽略大小写已${
                isIgnoreCase ? '开启' : '关闭'
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>是否允许选择文本</span>
            <span className={styles.sectionDescription}>开启后，可以通过鼠标选择文本 </span>
            <div className={styles.switchBlock}>
              <Switch checked={isTextSelectable} onChange={onToggleTextSelectable} className="switch-root">
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`选择文本已${
                isTextSelectable ? '开启' : '关闭'
              }`}</span>
            </div>
          </div>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>是否允许默写模式下显示提示</span>
            <span className={styles.sectionDescription}>开启后，可以通过鼠标 hover 单词显示正确答案 </span>
            <div className={styles.switchBlock}>
              <Switch checked={isShowAnswerOnHover} onChange={onToggleShowAnswerOnHover} className="switch-root">
                <span aria-hidden="true" className="switch-thumb" />
              </Switch>
              <span className="text-right text-xs font-normal leading-tight text-gray-600">{`显示提示已${
                isShowAnswerOnHover ? '开启' : '关闭'
              }`}</span>
            </div>
          </div>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent " orientation="vertical"></ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
