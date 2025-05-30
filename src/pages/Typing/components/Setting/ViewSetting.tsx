import styles from './index.module.css'
import { defaultFontSizeConfig } from '@/constants'
import { fontSizeConfigAtom } from '@/store'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import * as Slider from '@radix-ui/react-slider'
import { useAtom } from 'jotai'
import { useCallback } from 'react'

/**
 * 视图设置
 * 用于设置打字练习的视图
 * @returns 视图设置
 */
export default function ViewSetting() {
  /**
   * 字体大小配置
   */
  const [fontSizeConfig, setFontsizeConfig] = useAtom(fontSizeConfigAtom)

  /**
   * 切换外语字体大小
   */
  const onChangeForeignFontSize = useCallback(
    /**
     * 切换外语字体大小
     */
    (value: [number]) => {
      setFontsizeConfig((prev) => ({
        ...prev, // 设置字体大小配置
        foreignFont: value[0], // 设置外语字体大小
      }))
    },
    [setFontsizeConfig],
  )

  /**
   * 切换中文字体大小
   */
  const onChangeTranslateFontSize = useCallback(
    /**
     * 切换中文字体大小
     */
    (value: [number]) => {
      setFontsizeConfig((prev) => ({
        ...prev, // 设置字体大小配置
        translateFont: value[0], // 设置中文字体大小
      }))
    },
    [setFontsizeConfig],
  )

  /**
   * 重置字体大小
   */
  const onResetFontSize = useCallback(() => {
    setFontsizeConfig({ ...defaultFontSizeConfig }) // 重置字体大小配置
  }, [setFontsizeConfig])

  return (
    <ScrollArea.Root className="flex-1 select-none overflow-y-auto ">
      <ScrollArea.Viewport className="h-full w-full px-3">
        <div className={styles.tabContent}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>字体设置</span>
            <div className={styles.block}>
              <span className={styles.blockLabel}>外语字体</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider.Root
                  value={[fontSizeConfig.foreignFont]}
                  min={20}
                  max={96}
                  step={4}
                  className="slider"
                  onValueChange={onChangeForeignFontSize}
                >
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumb />
                </Slider.Root>
                <span className="ml-4 w-10 text-xs font-normal text-gray-600">{fontSizeConfig.foreignFont}px</span>
              </div>
            </div>

            <div className={styles.block}>
              <span className={styles.blockLabel}>中文字体</span>
              <div className="flex h-5 w-full items-center justify-between">
                <Slider.Root
                  value={[fontSizeConfig.translateFont]}
                  max={60}
                  min={14}
                  step={4}
                  className="slider"
                  onValueChange={onChangeTranslateFontSize}
                >
                  <Slider.Track>
                    <Slider.Range />
                  </Slider.Track>
                  <Slider.Thumb />
                </Slider.Root>
                <span className="ml-4 w-10 text-xs font-normal text-gray-600">{fontSizeConfig.translateFont}px</span>
              </div>
            </div>
          </div>
          <button className="my-btn-primary ml-4 disabled:bg-gray-300" type="button" onClick={onResetFontSize} title="重置字体设置">
            重置字体设置
          </button>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent " orientation="vertical"></ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
