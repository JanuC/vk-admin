<template>
  <div class="w-full h-full relative">
    <div class="absolute right-0 text-xs top-0 p-1 z-50 w-[10rem]">
      <el-select size="small" v-model="selectVal" fit-input-width @change="handleChange">
        <el-option label="最近7天" value="7" class="!text-xs !h-[2.4rem] flex items-center"></el-option>
        <el-option label="最近1个月" value="30" class="!text-xs !h-[2.4rem] flex items-center"></el-option>
        <el-option label="最近3个月" value="90" class="!text-xs !h-[2.4rem] flex items-center"></el-option>
        <el-option label="最近1年" value="365" class="!text-xs !h-[2.4rem] flex items-center"></el-option>
      </el-select>
    </div>
    <Echart :options="options" />
  </div>
</template>

<script lang="ts" setup name="BlogDateCountEchart">
import { getBlogDateCount } from '@/http/api/blog'
import * as echarts from 'echarts'

const selectVal = ref<string>('7')

const options = ref<echarts.EChartsOption>({})

const initOptions = (data: BlogDateCountProps[]) => {
  const option: echarts.EChartsOption = {
    title: {
      text: '用户博客发布情况',
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
        symbolSize: 1,
        symbol: 'circle',
        smooth: true,
        itemStyle: {
          color: '#73DD39',
        },
        lineStyle: {
          // color: '#73DDC9',
          color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
            {
              offset: 0,
              color: '#73DD39',
            },
            {
              offset: 1,
              color: '#73DDFF',
            },
          ]),
          shadowColor: 'rgba(115,221,255, 0.3)',
          shadowBlur: 10,
          shadowOffsetY: 20,
        },
        showSymbol: false,
      },
    ],
  }
  console.log(option)

  options.value = option
}

const getData = async () => {
  const { data } = await getBlogDateCount({ days: selectVal.value })
  initOptions(data)
}

const handleChange = () => {
  getData()
}

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped></style>
