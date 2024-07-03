<template>
  <template v-for="item in props.menuList" :key="item.path">
    <el-sub-menu :index="item.path" v-if="item.children?.length">
      <template #title>
        <el-icon v-if="item.meta.icon">
          <component :is="getIconComponent(item.meta.icon)"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <el-menu-item-group>
        <MenuTree :menuList="item.children" />
      </el-menu-item-group>
    </el-sub-menu>
    <el-menu-item :index="item.path" v-else>
      <el-icon v-if="item.meta.icon">
        <component :is="getIconComponent(item.meta.icon)"></component>
      </el-icon>
      <template #title>
        <span>{{ item.meta.title }}</span>
      </template>
    </el-menu-item>
  </template>
</template>

<script lang="ts" setup>
import * as ElIcons from '@element-plus/icons-vue'
const props = defineProps(['menuList'])

const iconMap: { [key: string]: any } = Object.fromEntries(
  Object.entries(ElIcons).map(([key, component]) => [
    key.replace('El', ''),
    component,
  ])
)

const getIconComponent = (iconName: string) => iconMap[iconName] || null

console.log(props)
</script>

<style lang="scss" scoped>
.tree.el-menu-item {
  background-color: #1f2d3d !important;
}
.tree.el-menu-item:hover {
  background-color: #001528 !important;
}
.tree.el-submenu__title {
  background-color: #1f2d3d !important;
}
</style>
