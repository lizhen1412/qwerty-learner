import purple from './purple.json'
import useWindowSize from '@/hooks/useWindowSize'
import { isOpenDarkModeAtom } from '@/store'
import { LineChart } from 'echarts/charts'
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { useAtom } from 'jotai'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'

/**
 * 注册 echarts 主题
 */
echarts.registerTheme('purple', purple)
echarts.use([GridComponent, TitleComponent, TooltipComponent, LineChart, CanvasRenderer])

/**
 * 折线图组件属性
 */
interface LineChartsProps {
  title: string
  data: [string, number][]
  name: string
  suffix?: string
}

/**
 * 折线图组件
 * @param param0
 * @returns
 */
const LineCharts: FC<LineChartsProps> = ({ data, title, suffix, name }) => {
  const [isOpenDarkMode] = useAtom(isOpenDarkModeAtom)

  /**
   * 图表引用
   */
  const chartRef = useRef<HTMLDivElement>(null)

  /**
   * 窗口大小
   */
  const { width, height } = useWindowSize()

  /**
   * 使用 useEffect 监听数据变化
   */
  useEffect(() => {
    if (!chartRef.current || !data.length) return

    /**
     * 图表实例
     */
    let chart = echarts.getInstanceByDom(chartRef.current)
    chart?.dispose()

    chart = echarts.init(chartRef.current, isOpenDarkMode ? 'purple' : 'light')

    /**
     * 图表选项
     */
    const option = {
      tooltip: { trigger: 'axis' },
      grid: {
        left: '10%',
        right: '10%',
        top: '20%',
        bottom: '10%',
      },
      xAxis: {
        type: 'time',
        axisPointer: {
          label: {
            formatter: function (params: { seriesData: [{ data: [string, number] }] }) {
              return params.seriesData[0].data[0]
            },
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: { formatter: (value: number) => value + (suffix || '') },
      },
      series: [
        {
          name,
          type: 'line',
          smooth: true,
          data: data,
          emphasis: { focus: 'series' },
        },
      ],
    }

    chart.setOption(option)
  }, [data, title, suffix, name, isOpenDarkMode])

  /**
   * 使用 useEffect 监听窗口大小变化
   */
  useEffect(() => {
    if (!chartRef.current) return
    const chart = echarts.getInstanceByDom(chartRef.current)
    chart?.resize()
  }, [width, height, chartRef])

  /**
   * 返回折线图组件
   * @returns 折线图组件
   */
  return (
    <div className="flex h-full flex-col">
      <div className="text-center text-xl font-bold text-gray-600	dark:text-white">{title}</div>
      <div style={{ width: '100%', height: '100%' }} ref={chartRef} className="line-chart flex-grow"></div>
    </div>
  )
}

export default LineCharts
