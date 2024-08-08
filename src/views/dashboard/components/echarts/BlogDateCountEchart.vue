<template>
  <div class="w-full h-full">
    <Echart :options="options" />
  </div>
</template>

<script lang="ts" setup>
import { getBlogDateCount } from '@/http/api/blog'

const options = ref<echarts.EChartsOption>({})

const initOptions = (data: BlogDateCountProps[]) => {
  const option: echarts.EChartsOption = {
    title: {
      text: '用户访问日志',
      textStyle: {
        fontSize: 12,
      },
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: '时间: {b}<br />博客数: {c}',
    },
    xAxis: {
      show: true,
      type: 'category',
      name: '时间',
      data: data.map((item) => item.date),
    },
    yAxis: {
      show: true,
      type: 'value',
      name: '博客数',
      minInterval: 1,
    },
    series: [
      {
        type: 'line',
        // smooth: true,
        data: data.map((item) => item.count),
      },
    ],
  }
  console.log(option)

  options.value = option
}

const getData = async () => {
  const { data } = await getBlogDateCount()
  console.log('d', data)
  initOptions(data)
}

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped></style>
