<script setup lang="ts">
defineProps<{
  count: number
  car: string
}>()
const emit = defineEmits<{
  (e: 'update:count', count: number): void
  (e: 'update:car', car: string): void
}>()
</script>
<template>
  <div>
    comA {{ count }}
    <button @click="emit('update:count', count + 1)">加1</button>
    <br />
    {{ car }}
    <button @click="emit('update:car', '法拉利')">换车</button>
  </div>
</template>
