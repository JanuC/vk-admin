<!-- 公网带宽 -->
<template>
  <div class="w-full h-full relative">
    <div class="absolute right-[4rem] text-xs top-0 p-1 z-50 w-[11rem]">
      <el-select size="small" v-model="selectVal" fit-input-width @change="handleChange">
        <el-option label="最近10分钟" value="10" class="!text-xs !h-[2.4rem] flex items-center"></el-option>
        <el-option label="最近30分钟" value="30" class="!text-xs !h-[2.4rem] flex items-center"></el-option>
        <el-option label="最近60分钟" value="60" class="!text-xs !h-[2.4rem] flex items-center"></el-option>
        <el-option label="最近24小时" value="1440" class="!text-xs !h-[2.4rem] flex items-center"></el-option>
      </el-select>
    </div>
    <Echart :options="options" />
  </div>
</template>

<script lang="ts" setup>
import { getServerPublicBandwidthInfo } from '@/http/api/system'
import * as echarts from 'echarts'

const selectVal = ref<string>('60')

const options = ref<echarts.EChartsOption>({})

const initOptions = (data: ServerPublicBandwidthProps) => {
  const option: echarts.EChartsOption = {
    title: {
      text: '公网带宽(MBytes/s)',
      textStyle: {
        fontSize: 12,
      },
    },
    tooltip: {
      show: true,
      trigger: 'axis',
      formatter: (params: any) => {
        return `时间: ${params[0].axisValueLabel}</br>${params[1].marker}出: ${params[1].data}</br>${params[0].marker}入: ${params[0].data}`
      },
    },
    xAxis: {
      show: true,
      type: 'category',
      name: '时间',
      data: data.enterRecords.map((item) => item.date),
    },
    yAxis: {
      show: true,
      type: 'value',
      // name: '使用量(MB)',
      minInterval: 0.1,
      // max: 1024 * 4,
    },
    series: [
      {
        type: 'line',
        data: data.enterRecords.map((item) => item.count),
        symbolSize: 1,
        symbol: 'circle',
        itemStyle: {
          color: '#6FD497',
        },
        lineStyle: {
          color: '#6FD497',
          shadowColor: 'rgba(158,135,255, 0.3)',
          shadowBlur: 10,
          shadowOffsetY: 20,
        },
        showSymbol: false,
      },
      {
        type: 'line',
        data: data.outerRecords.map((item) => item.count),
        symbolSize: 1,
        symbol: 'circle',
        itemStyle: {
          color: '#2D70F6',
        },
        lineStyle: {
          color: '#2D70F6',
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
  const { data } = await getServerPublicBandwidthInfo({
    time: selectVal.value,
  })

  initOptions(data.records)
}

const handleChange = () => {
  getData()
}

onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped></style>
