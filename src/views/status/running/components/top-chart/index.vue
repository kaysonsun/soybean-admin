<template>
  <n-grid :x-gap="16" :y-gap="16" :item-responsive="true">
    <n-grid-item span="0:24 640:24 1024:6">
      <n-card :bordered="false" class="rounded-8px shadow-sm">
        <div class="w-full h-360px py-12px">
          <h3 class="text-16px font-bold">{{ runningData.runningTime }}</h3>
          <p class="text-#aaa">运行时长</p>

          <h3 class="pt-16px text-16px font-bold">{{ runningData.licenseStatus }}</h3>
          <p class="text-#aaa">许可状态</p>

          <h3 class="pt-16px text-16px font-bold">{{ runningData.licenseType }}</h3>
          <p class="text-#aaa">许可类型</p>

          <h3 class="pt-16px text-16px font-bold">{{ runningData.ownedTo }}</h3>
          <p class="text-#aaa">许可归属</p>

          <h3 class="pt-16px text-16px font-bold">{{ runningData.expiredAt }}</h3>
          <p class="text-#aaa">许可到期时间</p>
        </div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:9">
      <n-card :bordered="false" class="rounded-8px shadow-sm">
        <div ref="cpuLineRef" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
    <n-grid-item span="0:24 640:24 1024:9">
      <n-card :bordered="false" class="rounded-8px shadow-sm">
        <div ref="memLineRef" class="w-full h-360px"></div>
      </n-card>
    </n-grid-item>
<!--    <n-grid-item span="0:24 640:24 1024:8">-->
<!--      <n-card :bordered="false" class="rounded-8px shadow-sm">-->
<!--        <div ref="memLineRef" class="w-full h-360px"></div>-->
<!--      </n-card>-->
<!--    </n-grid-item>-->
    <!--    <n-grid-item span="0:24 640:24 1024:8">-->
    <!--      <n-card :bordered="false" class="rounded-8px shadow-sm">-->
    <!--        <div ref="pieRef" class="w-full h-360px"></div>-->
    <!--      </n-card>-->
    <!--    </n-grid-item>-->
  </n-grid>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import type {Ref} from 'vue';
import {type ECOption, useEcharts} from '@/composables';
import {fetchRunningInfo, fetchSysMetrics} from "@/service";

defineOptions({name: 'DashboardAnalysisTopCard'});

// 运行信息
const runningData: Ref<Metrics.RunningInfo> = ref({
  runningTime: '',
  licenseType: '',
  ownedTo: '',
  expiredAt: '',
  licenseStatus: ''
});
const getRunningInfo = async () => {
  const {data} = await fetchRunningInfo()
  if (data) {
    runningData.value = data
  }
}

//曲线图
const cpuLineOptions = ref<ECOption>({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: ['CPU']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'time'
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: {
    color: '#8e9dff',
    name: 'CPU',
    type: 'line',
    smooth: true,
    stack: 'Total',
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0.25,
            color: '#8e9dff'
          },
          {
            offset: 1,
            color: '#fff'
          }
        ]
      }
    },
    emphasis: {
      focus: 'series'
    },
    data: []
  }
}) as Ref<ECOption>;
const {domRef: cpuLineRef} = useEcharts(cpuLineOptions)

const memLineOptions = ref<ECOption>({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#b447d2'
      }
    }
  },
  legend: {
    data: ['MEM']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'time'
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: {
    color: '#b447d2',
    name: 'MEM',
    type: 'line',
    smooth: true,
    stack: 'Total',
    areaStyle: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [
          {
            offset: 0.25,
            color: '#b447d2'
          },
          {
            offset: 1,
            color: '#fff'
          }
        ]
      }
    },
    emphasis: {
      focus: 'series'
    },
    data: []
  }
}) as Ref<ECOption>;
const {domRef: memLineRef} = useEcharts(memLineOptions)
const getSysMetrics = async () => {
  const {data} = await fetchSysMetrics()
  if (data) {
    console.log("MARK-03")
    console.log(data)
    for (let i = 0; i < data.cpu.length; i++) {
      if (cpuLineOptions.value.series) {
        cpuLineOptions.value.series.data.push([data.cpu[i].ts, data.cpu[i].used])
      }
    }
    for (let i = 0; i < data.mem.length; i++) {
      if (memLineOptions.value.series) {
        memLineOptions.value.series.data.push([data.mem[i].ts, (data.mem[i].total - data.mem[i].free) / data.mem[i].total])
      }
    }
  }

}

onMounted(() => {
  getRunningInfo();
  getSysMetrics()
});

// ##########################################


const pieOptions = ref<ECOption>({
  tooltip: {
    trigger: 'item'
  },
  legend: {
    bottom: '1%',
    left: 'center',
    itemStyle: {
      borderWidth: 0
    }
  },
  series: [
    {
      color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca'],
      name: '时间安排',
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        {value: 20, name: '学习'},
        {value: 10, name: '娱乐'},
        {value: 30, name: '工作'},
        {value: 40, name: '休息'}
      ]
    }
  ]
}) as Ref<ECOption>;
const {domRef: pieRef} = useEcharts(pieOptions);
</script>

<style scoped></style>
