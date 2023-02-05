<script setup lang="ts">
// unplugin-vue-components 包还可以导入components里面的组件
// import CpNavBar from '@/components/CpNavBar.vue'

const fn = () => {
  console.log('业务')
}
</script>

<template>
  <CpNavBar right-text="帮助" @clickRight="fn"></CpNavBar>
</template>

<style lang="scss" scoped></style>
