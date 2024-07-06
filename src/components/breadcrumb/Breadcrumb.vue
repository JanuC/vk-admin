<template>
  <div class="breadcrum my-[1rem] !text-[2.2rem]">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item
        v-for="item in crumbs"
        :key="item.path"
        :to="item.path"
        >{{ item.meta?.title }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { RouteRecordRaw } from 'vue-router'
const route = useRoute()

const crumbs = ref<RouteRecordRaw[]>([])

const crumbsHandle = () => {
  crumbs.value = []
  route.matched.forEach((item) => {
    crumbs.value.push(item)
  })
  crumbs.value.shift()
}

watchEffect(() => crumbsHandle())
</script>

<style lang="scss" scoped></style>
