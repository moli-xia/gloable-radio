<template>
  <div class="station-skeleton ios-card dark:bg-dark-surface dark:border-dark-gray p-4">
    <div class="flex items-center gap-4">
      <!-- 图标骨架 -->
      <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-gray-200 dark:bg-dark-gray rounded-ios animate-pulse"></div>
      </div>
      
      <!-- 内容骨架 -->
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-gray-200 dark:bg-dark-gray rounded animate-pulse w-3/4"></div>
        <div class="h-3 bg-gray-200 dark:bg-dark-gray rounded animate-pulse w-1/2"></div>
        <div class="h-3 bg-gray-200 dark:bg-dark-gray rounded animate-pulse w-2/3"></div>
      </div>
      
      <!-- 按钮骨架 -->
      <div class="flex items-center gap-2">
        <div class="w-9 h-9 bg-gray-200 dark:bg-dark-gray rounded-full animate-pulse"></div>
        <div class="w-11 h-11 bg-gray-200 dark:bg-dark-gray rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 无需任何逻辑，纯展示组件
</script>