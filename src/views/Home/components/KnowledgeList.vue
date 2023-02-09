<script setup lang="ts">
import KnowledgeCard from './KnowledgeCard.vue'
import { List } from 'vant'
import { ref } from 'vue'
import type {
  KnowledgeList,
  KnowledgeParams,
  KnowledgeType
} from '@/types/consult'
import { getKnowledgePage } from '@/services/consult'
const props = defineProps<{
  type: KnowledgeType
}>()

// 实现加载更多
const loading = ref(false)
const finished = ref(false)
// 接受返回渲染文章
const list = ref<KnowledgeList>([])
// 请求参数
const params = ref<KnowledgeParams>({
  type: props.type, // 请求类型
  current: 1, // 页码
  pageSize: 5 // 每页数量
})
// 下拉刷新
const onLoad = async () => {
  // 请求获取数据
  const res = await getKnowledgePage(params.value)
  list.value.push(...res.data.rows)
  // 判断如果请求的页码 >= 返回的总页码 就说明没有数据了
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  } else params.value.current++
  loading.value = false
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <KnowledgeCard
        v-for="item in list"
        :key="item.id"
        :item="item"
      ></KnowledgeCard>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
