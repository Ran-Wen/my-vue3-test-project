<template>
  <div class="treeContainer">
    <!-- <el-button type="primary" @click="loadTree">加载树结构</el-button> -->
    <el-tree v-if="treeData.length" :data="treeData" :props="{ label: 'label' }" default-expand-all show-checkbox />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const treeData = ref([])

const loadTree = async () => {
  const res = await axios.get('/api/tree/list')
  if (res.data.code === 200) {
    treeData.value = res.data.data
    console.log(treeData.value)
  }
}
onMounted(() => {
  loadTree()
})
</script>
<style scoped lang="css">
.treeContainer {
  height: calc(100vh - 200px);
  overflow-y: auto;
}
</style>
