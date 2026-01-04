<template>
  <div class="animated-background">
    <div class="bubbles">
      <div v-for="i in 20" :key="i" class="bubble"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No script needed for this component
</script>

<style scoped>
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.bubbles {
  position: relative;
  width: 100%;
  height: 100%;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  opacity: 0.8;
  animation: rise 25s infinite ease-in;
  bottom: -200px;
}

@keyframes rise {
  0% {
    transform: translateY(0) scale(1);
  }
  100% {
    transform: translateY(-120vh) scale(1.5);
    opacity: 0;
  }
}

/* Dynamically generate bubble properties */
.bubble:nth-child(1) {
  width: 80px; height: 80px; left: 10%; animation-duration: 20s; animation-delay: 0s; background: #ff4e50;
}
.bubble:nth-child(2) {
  width: 120px; height: 120px; left: 20%; animation-duration: 25s; animation-delay: 2s; background: #fcb1b1;
}
.bubble:nth-child(3) {
  width: 60px; height: 60px; left: 35%; animation-duration: 30s; animation-delay: 4s; background: #ff8e53;
}
.bubble:nth-child(4) {
  width: 90px; height: 90px; left: 50%; animation-duration: 18s; animation-delay: 1s; background: #f9d423;
}
.bubble:nth-child(5) {
  width: 50px; height: 50px; left: 55%; animation-duration: 28s; animation-delay: 3s; background: #ede574;
}
.bubble:nth-child(6) {
  width: 150px; height: 150px; left: 65%; animation-duration: 22s; animation-delay: 5s; background: #e1f5c4;
}
.bubble:nth-child(7) {
  width: 70px; height: 70px; left: 80%; animation-duration: 35s; animation-delay: 0s; background: #a8e6cf;
}
.bubble:nth-child(8) {
  width: 110px; height: 110px; left: 90%; animation-duration: 19s; animation-delay: 2s; background: #dcedc1;
}
.bubble:nth-child(9) {
  width: 75px; height: 75px; left: 25%; animation-duration: 26s; animation-delay: 6s; background: #ffd3b6;
}
.bubble:nth-child(10) {
  width: 130px; height: 130px; left: 5%; animation-duration: 23s; animation-delay: 8s; background: #ffaaa5;
}
.bubble:nth-child(11) {
  width: 85px; height: 85px; left: 45%; animation-duration: 29s; animation-delay: 1s; background: #a2d5f2;
}
.bubble:nth-child(12) {
  width: 100px; height: 100px; left: 75%; animation-duration: 21s; animation-delay: 3s; background: #ade498;
}
.bubble:nth-child(13) {
  width: 55px; height: 55px; left: 15%; animation-duration: 32s; animation-delay: 5s; background: #f7b7a3;
}
.bubble:nth-child(14) {
  width: 95px; height: 95px; left: 60%; animation-duration: 24s; animation-delay: 7s; background: #ea907a;
}
.bubble:nth-child(15) {
  width: 140px; height: 140px; left: 30%; animation-duration: 27s; animation-delay: 9s; background: #f0e1b3;
}
.bubble:nth-child(16) {
  width: 40px; height: 40px; left: 70%; animation-duration: 40s; animation-delay: 2s; background: #b5eaea;
}
.bubble:nth-child(17) {
  width: 65px; height: 65px; left: 0%; animation-duration: 26s; animation-delay: 4s; background: #ffc0cb;
}
.bubble:nth-child(18) {
  width: 105px; height: 105px; left: 85%; animation-duration: 20s; animation-delay: 6s; background: #c3aed6;
}
.bubble:nth-child(19) {
  width: 45px; height: 45px; left: 40%; animation-duration: 33s; animation-delay: 8s; background: #f3e6e3;
}
.bubble:nth-child(20) {
  width: 125px; height: 125px; left: 50%; animation-duration: 22s; animation-delay: 10s; background: #e4d8dc;
}
</style> 