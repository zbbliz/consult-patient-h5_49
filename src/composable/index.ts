import { ref } from 'vue'
import { followDoctor } from '@/services/consult'
import type { FollowType } from '@/types/consult'

// 封装逻辑，规范 useXxx，点击关注操作逻辑
export const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  // {a, b} 类型，传值得时候 {a, b, c} 也可以，这是类型兼容：多的可以给少的
  const follow = async (doc: { id: string; likeFlag: 0 | 1 }) => {
    // 点击打开loading加载赚钱
    loading.value = true
    try {
      await followDoctor(doc.id, type)
      // 调用接口服务器已经取反了数据也要取反
      doc.likeFlag = doc.likeFlag === 1 ? 0 : 1
    } finally {
      // 避免没有网络一直转圈
      loading.value = false
    }
  }
  return { loading, follow }
}
