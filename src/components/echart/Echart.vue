<template>
  <div ref="echartContainer" class="w-full h-full"></div>
</template>

<script lang="ts" setup name="Echart">
import * as echarts from 'echarts'

type EchartProps = {
  options: echarts.EChartsOption
}

const props = defineProps<EchartProps>()

const echartContainer = ref<HTMLElement>()

// const chart = ref<echarts.ECharts>()

let chart: echarts.ECharts | null = null

const renderChart = () => {
  if (echartContainer.value) {
    if (!chart) {
      // 需要将其指定为非响应式的，否则无法跟随屏幕变化而变化
      chart = echarts.init(echartContainer.value)
    }

    chart.setOption(props.options)
  }
}

const resizeChart = () => {
  if (chart) {
    chart.resize()
  }
}

onMounted(() => {
  window.addEventListener('resize', resizeChart)
})

onUpdated(() => {
  renderChart()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
})
</script>

<style lang="scss" scoped></style>
