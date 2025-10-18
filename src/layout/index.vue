<template>
  <div class="layout">
    <!-- 顶部导航 -->
    <div class="nav-bar">
      <el-button v-for="btn in buttons" :key="btn.path" :class="{ active: route.path === btn.path }"
        @click="router.push(btn.path)">
        {{ btn.label }}
      </el-button>
    </div>

    <!-- 页面内容区域 -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const buttons = [
  { label: '定时提前数据', path: '/fixedData' },
  { label: '基站信号强度展示', path: '/map' },
]
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.nav-bar {
  margin: 10px 0;
  background: #fff;
  // border-bottom: 1px solid #ddd;
  display: flex;
  gap: 10px;
}

.el-button {
  transition: all 0.3s ease;
  background: #f5f5f5;
  color: #333;
  border: 1px solid #dcdfe6;

  &:hover {
    background: linear-gradient(45deg, #4facfe, #00fe55);
    color: #fff;
  }

  &.active {
    background: linear-gradient(45deg, #4facfe, #00fe55);
    color: #fff;
    border: none;
    box-shadow: 0 0 10px rgba(0, 242, 254, 0.6);
    transform: scale(1.05);
  }
}

.content {
  flex: 1;
  padding: 10px;
  overflow: auto;
  background: #fafafa;
  width: 100vw;
  height: calc(100vh - 300px);
}
</style>
