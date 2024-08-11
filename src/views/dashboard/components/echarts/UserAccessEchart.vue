<!-- 用户访问情况 -->
<template>
  <div class="w-full h-full relative">
    <div class="absolute right-0 text-xs top-0 p-1 z-50 w-[40rem]">
      <el-date-picker
        v-model="queryForm.date"
        size="small"
        type="datetimerange"
        :default-time="defaultTime"
        value-format="YYYY-MM-DD HH:mm:ss"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        @change="handleChange"
      />
    </div>
    <Echart :options="options" />
  </div>
</template>

<script lang="ts" setup name="UserAccessEchart">
import * as echarts from 'echarts'
import axios from 'axios'
import { getUserAccessListByFilter } from '@/http/api/userAccess'
import { formatDate } from '@/utils/formatDate'

const queryForm = ref({
  date: [],
})

const defaultTime: [Date, Date] = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]

const options = ref<echarts.EChartsOption>({})

const initOptions = async (data: UserAccessProps[]) => {
  const json = await getMapJson()

  echarts.registerMap('china', json)

  const option: echarts.EChartsOption = {
    // backgroundColor: '#013954',
    title: {
      text: '用户访问情况',
      textStyle: {
        fontSize: 12,
      },
    },
    tooltip: {
      show: true,
    },
    geo: {
      map: 'china',
      aspectScale: 0.75,
      zoom: 1.1,
      roam: false,
      itemStyle: {
        areaColor: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.8,
          colorStops: [
            {
              offset: 0,
              color: '#09132c', // 0% 处的颜色
            },
            {
              offset: 1,
              color: '#274d68', // 100% 处的颜色
            },
          ],
          global: true, // 缺省为 false
        },
        shadowColor: 'rgb(58,115,192)',
        shadowOffsetX: 10,
        shadowOffsetY: 11,
      },
      emphasis: {
        itemStyle: {
          areaColor: '#2AB8FF',
          borderWidth: 0,
          color: 'green',
        },

        label: {
          show: false,
        },
      },
      regions: [
        {
          name: '南海诸岛',
          itemStyle: {
            areaColor: 'rgba(0, 10, 52, 1)',
            borderColor: 'rgba(0, 10, 52, 1)',
            opacity: 0,
          },
          label: {
            show: false,
            color: '#009cc9',
          },
        },
      ],
    },
    series: [
      {
        type: 'map',
        roam: false,
        label: {
          show: true,
          color: '#1DE9B6',
        },
        emphasis: {
          label: {
            color: 'rgb(183,185,14)',
          },
          itemStyle: {
            areaColor: 'rgb(46,229,206)',
            borderWidth: 0.1,
          },
        },
        itemStyle: {
          borderColor: 'rgb(147, 235, 248)',
          borderWidth: 1,
          areaColor: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [
              {
                offset: 0,
                color: '#09132c', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#274d68', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        tooltip: {
          formatter: (params) => {
            const province = params.name
            const array = data.filter((item) => item.province.includes(province))
            const value = array.reduce((acc, curr) => {
              return acc + curr.visits
            }, 0)
            return `${province}</br>总访问量: ${value}`
          },
        },
        zoom: 1.1,
        map: 'china',
      },

      {
        type: 'lines',
        zlevel: 2,
        effect: {
          show: true,
          period: 4,
          trailLength: 0.4,
          symbol: 'arrow',
          symbolSize: 7,
        },
        lineStyle: {
          color: '#1de9b6',
          width: 1,
          opacity: 0.1,
          curveness: 0.3,
        },
        tooltip: {
          show: false,
        },
        data: data.map((item) => {
          return {
            coords: [
              [item.lon, item.lat],
              [121.4648, 31.2891],
            ],
            lineStyle: { color: '#00FA02' },
          }
        }),
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        showEffectOn: 'render',
        zlevel: 1,
        // rippleEffect: {
        //   period: 15,
        //   scale: 4,
        //   brushType: 'fill',
        // },
        label: {
          formatter: '{b}',
          position: 'right',
          offset: [15, 0],
          color: '#1de9b6',
          show: true,
        },
        itemStyle: {
          color: '#1de9b6',
          shadowBlur: 10,
          shadowColor: '#333',
        },
        symbolSize: 12,
        tooltip: {
          show: true,
          formatter: (params) => {
            const data = params.data as UserAccessChatProps
            return `IP: ${data.ip}</br>IP定位: ${data.province + '-' + data.city}</br>访问次数: ${data.visits}</br>上次访问: ${formatDate(data.lastVisitTime!)}`
          },
        },
        data: data
          .map((item: UserAccessChatProps) => {
            item.itemStyle = {
              color: '#00FA02',
            }
            item.value = [item.lon!, item.lat!]
            return item
          })
          .concat([
            {
              value: [121.4648, 31.2891],
              itemStyle: { color: '#F44336' },
              tooltip: {
                // show: false,
                formatter: '服务器地址: 上海市',
              },
            },
          ]),
      },
    ],
  }

  options.value = option
}

const getMapJson = async () => {
  const { data } = await axios.get('assets/json/chinaMap.json')

  return Promise.resolve(data)
}

const getData = async () => {
  const { date } = queryForm.value
  let [startTime, endTime] = date ? date : []
  const { data } = await getUserAccessListByFilter({ startTime, endTime })

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
