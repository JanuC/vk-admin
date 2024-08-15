<template>
  <div class="w-full h-full relative">
    <div class="absolute right-[4rem] text-xs top-0 p-1 z-50 w-[10rem]">
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

<script lang="ts" setup>
import { getUserAccessCountByDays } from '@/http/api/userAccess'
import * as echarts from 'echarts'

const selectVal = ref<string>('7')

const options = ref<echarts.EChartsOption>({})

const initOptions = (data: BlogDateCountProps[]) => {
  const option: echarts.EChartsOption = {
    title: {
      text: '访客量情况',
      textStyle: {
        fontSize: 12,
      },
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: (params: any) => {
        return `日期: ${params[0].axisValueLabel}</br>${params[0].marker}访客量: ${params[0].data}`
      },
    },
    xAxis: {
      show: true,
      type: 'category',
      name: '日期',
      data: data.map((item) => item.date),
    },
    yAxis: {
      show: true,
      type: 'value',
      name: '访客量',
      minInterval: 1,
    },
    series: [
      {
        type: 'line',
        data: data.map((item) => item.count),
        symbolSize: 1,
        symbol: 'circle',
        // smooth: true,
        itemStyle: {
          color: '#9E87FF',
          borderColor: '#9E87FF',
        },
        lineStyle: {
          // color: '#73DDC9',
          color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
            {
              offset: 0,
              color: '#9effff',
            },
            {
              offset: 1,
              color: '#9E87FF',
            },
          ]),
          shadowColor: 'rgba(158,135,255, 0.3)',
          shadowBlur: 10,
          shadowOffsetY: 20,
        },
        showSymbol: false,
      },
    ],
  }

  options.value = option
}

const getData = async () => {
  const { data } = await getUserAccessCountByDays({ days: selectVal.value })

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
