<template>
  <div class="container">
    <div class="top">
      <el-button type="info" :icon="Plus">新增</el-button>
      <el-button type="success" :icon="Download" @click="exportSelected">导出</el-button>
      <el-button type="primary" :icon="View">隐藏筛选</el-button>
      <el-button type="danger" :icon="Delete" @click="deleteAll">批量删除</el-button>
      <el-button type="success" :icon="Upload" @click="importExcel">批量导入</el-button>
      <input ref="fileInput" type="file" accept=".xlsx, .xls" style="display: none" @change="handleFileChange" />

    </div>
    <div class="bottom">
      <div class="left">
        <left></left>
      </div>
      <div class="right">
        <right ref="rightChild"></right>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Plus, View, Download, Upload, Delete } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus'
import * as XLSX from 'xlsx'
import { ref } from 'vue'
import left from './left/index.vue'
import right from './right/index.vue'
const rightChild = ref(null)
const fileInput = ref(null)
// 批量删除
const deleteAll = () => {
  if (!rightChild.value) return
  const selectedRows = rightChild.value.getSelectedRows()
  if (!selectedRows || selectedRows.length === 0) {
    return ElMessage.warning('请先选择要删除的行')
  }

  ElMessageBox.confirm(`确定删除选中的 ${selectedRows.length} 条记录吗？`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    rightChild.value.deleteSelectedRows()
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}
const exportSelected = () => {
  if (!rightChild.value) return
  const selectedRows = rightChild.value.getSelectedRows()
  if (!selectedRows || selectedRows.length === 0) {
    return ElMessage.warning('请先选择要导出的行')
  }

  // 将数据转换成 XLSX Sheet
  const worksheet = XLSX.utils.json_to_sheet(selectedRows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // 导出 Excel
  XLSX.writeFile(workbook, '导出数据.xlsx')
}
// 点击按钮时触发选择文件
const importExcel = () => {
  fileInput.value.click()
}
// 文件导入
const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const importedData = XLSX.utils.sheet_to_json(worksheet)
    if (rightChild.value) {
      rightChild.value.appendData(importedData)
      ElMessage.success(`成功导入 ${importedData.length} 条记录`)
    }

    e.target.value = ''
  }

  reader.readAsArrayBuffer(file)
}
</script>
<style lang="css" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  margin-bottom: 10px;
}

.top {
  flex: 1;
  background-color: rgb(240, 255, 254);
  align-content: center;
}

.bottom {
  flex: 10;
  display: flex;

}

.left {
  flex: 2;
  margin: 10px;
}

.right {
  flex: 8;
  background-color: #ffffff;
  margin: 10px;
}
</style>