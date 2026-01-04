<template>
  <div class="top-layer-effects">
    <!-- 顶层装饰性动画元素 -->
    <div class="decoration-orb orb-1"></div>
    <div class="decoration-orb orb-2"></div>
    <div class="decoration-orb orb-3"></div>
    <div class="decoration-orb orb-4"></div>
    <div class="decoration-orb orb-5"></div>
  </div>
</template>

<script setup lang="ts">
// 纯CSS动画组件，无需JavaScript逻辑
</script>

<style scoped>
.top-layer-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 关键：确保不拦截用户操作 */
  z-index: 1; /* 较低的z-index，保证在内容之下 */
  overflow: hidden;
}

.decoration-orb {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
  animation: floatAndFade 20s infinite ease-in-out;
}

/* 不同大小和位置的装饰球 */
.orb-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
  animation-duration: 25s;
}

.orb-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 10%;
  animation-delay: -5s;
  animation-duration: 30s;
}

.orb-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 15%;
  animation-delay: -10s;
  animation-duration: 35s;
}

.orb-4 {
  width: 60px;
  height: 60px;
  top: 30%;
  right: 25%;
  animation-delay: -15s;
  animation-duration: 28s;
}

.orb-5 {
  width: 140px;
  height: 140px;
  bottom: 10%;
  right: 5%;
  animation-delay: -20s;
  animation-duration: 32s;
}

@keyframes floatAndFade {
  0%, 100% {
    transform: translateY(0px) translateX(0px) scale(1);
    opacity: 0.1;
  }
  25% {
    transform: translateY(-20px) translateX(10px) scale(1.1);
    opacity: 0.15;
  }
  50% {
    transform: translateY(-10px) translateX(-15px) scale(0.9);
    opacity: 0.08;
  }
  75% {
    transform: translateY(15px) translateX(5px) scale(1.05);
    opacity: 0.12;
  }
}

/* 响应式调整 - 在移动端减少动画复杂度 */
@media (max-width: 768px) {
  .decoration-orb {
    animation-duration: 40s !important; /* 在移动端减慢动画速度 */
  }
  
  /* 在小屏幕上隐藏一些装饰球以提升性能 */
  .orb-4, .orb-5 {
    display: none;
  }
}

/* 暗色模式下的调整 */
@media (prefers-color-scheme: dark) {
  .decoration-orb {
    background: linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(147, 51, 234, 0.05));
  }
}
</style> 