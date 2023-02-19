<script setup lang="ts">
import { evaluateConsultOrder } from '@/services/consult'
import type { ConsultOrderItem } from '@/types/consult'
import type { EvaluateDoc } from '@/types/room'
import { Toast } from 'vant'
import { computed, inject, type Ref, ref } from 'vue'

defineProps<{
  evaluateDoc?: EvaluateDoc
}>()

// 收集评价提交需要的数据
// 表单：score评分 content内容 anonymousFlag是否匿名
// 父父级index.vue
// consult.id 订单id  consult.docInfo.id 医生id
const consult = inject<Ref<ConsultOrderItem>>('consult')

const score = ref(0) // 评分
const content = ref('') // 评价内容
const anonymousFlag = ref(false) // 是否匿名
// 按钮显示效果 当都有值的时候显示时间
const disabled = computed(() => !score.value || !content.value)
// 点击提交评价
const onSubmit = async () => {
  if (!score.value) return Toast('请对本次问诊服务评分')
  if (!content.value) return Toast('请输入对本次问诊或者对医生的评价')
  if (!consult?.value) return Toast('未找到订单')
  if (consult.value.docInfo?.id) {
    // 提交评价
    await evaluateConsultOrder({
      docId: consult?.value.docInfo?.id,
      orderId: consult.value.id,
      score: score.value,
      content: content.value,
      anonymousFlag: anonymousFlag.value ? 1 : 0
    })
  }
  // 提交评价后修改状态
  completeEva && completeEva(score.value)
}
const completeEva = inject<(score: number) => void>('completeEva')
</script>
<template>
  <!-- 显示卡片 -->
  <div class="evalutate-card" v-if="evaluateDoc">
    <p class="title">医生服务评价</p>
    <p class="desc">我们会更加努力提升服务质量</p>
    <van-rate
      :modelValue="evaluateDoc.score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
  </div>
  <!-- 评价表单 -->
  <div class="evalutate-card" v-else>
    <p class="title">感谢您的评价</p>
    <p class="desc">本次在线问诊服务您还满意吗？</p>
    <van-rate
      v-model="score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
    <van-field
      v-model="content"
      type="textarea"
      maxlength="150"
      show-word-limit
      rows="3"
      placeholder="请描述您对医生的评价或是在医生看诊过程中遇到的问题"
    ></van-field>
    <div class="footer">
      <van-checkbox v-model="anonymousFlag">匿名评价</van-checkbox>
      <van-button
        @click="onSubmit"
        :class="{ disabled }"
        type="primary"
        size="small"
        round
      >
        提交评价
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.evalutate-card {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 15px;
  .title {
    font-size: 15px;
    margin-bottom: 5px;
  }
  .desc {
    font-size: 12px;
    margin-bottom: 15px;
    color: var(--cp-tip);
  }
  .van-field {
    background-color: var(--cp-bg);
    margin: 15px 0;
    border-radius: 8px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    ::v-deep() {
      .van-checkbox {
        .van-icon {
          font-size: 12px;
        }
        &__label {
          font-size: 12px;
          color: var(--cp-tip);
        }
        height: 16px;
      }
      .van-button {
        padding: 0 16px;
        &.disabled {
          opacity: 1;
          background: #fafafa;
          color: #d9dbde;
          border: #fafafa;
        }
      }
    }
  }
}
</style>
