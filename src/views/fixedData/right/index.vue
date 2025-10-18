<template>
  <div style="padding: 20px">
    <el-form :inline="true" size="small" class="filter-form">
      <el-form-item>
        <el-input placeholder="搜索小区ID、基站ID" v-model="filters.search" />
      </el-form-item>
      <el-form-item>
        <el-select placeholder="网络制式" v-model="filters.networkType" clearable style="width: 100px;">
          <el-option label="4G" value="4G" />
          <el-option label="5G" value="5G" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="子载波间隔" v-model="filters.scs" clearable style="width: 100px;">
          <el-option label="15kHz" value="15" />
          <el-option label="30kHz" value="30" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="filters.startDate" type="date" placeholder="开始日期" />
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="filters.endDate" type="date" placeholder="结束日期" />
      </el-form-item>
      <el-form-item>
        <el-button type="default" @click="resetFilters">清除筛选</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table :max-height="`calc(100vh - 230px)`" :data="paginatedData" style="width: 100%; margin-bottom: 10px;" border
      @selection-change="handleSelectionChange" ref="tableRef">
      <!-- 多选 -->
      <el-table-column type="selection" width="55" />

      <!-- 数据列 -->
      <el-table-column type="index" label="序号" width="100" sortable />
      <el-table-column prop="CellIdentity" label="小区标识" />
      <el-table-column prop="BS_ID" label="基站标识" />
      <el-table-column prop="Datatime" label="采样时间" sortable />
      <el-table-column prop="Longitude" label="采样点经度" />
      <el-table-column prop="Latitude" label="采样点维度" />
      <el-table-column prop="MCC" label="MCC" width="60" />
      <el-table-column prop="MNC" label="MNC" width="60" />
      <el-table-column prop="NetworkType" label="网络制式" />
      <el-table-column prop="SCS" label="子载波间隔" />
      <el-table-column prop="RSRP" label="RSRP" />
      <el-table-column prop="DL_Frequency" label="下行频点" />
      <el-table-column prop="PRACH_TA" label="PRACH_TA" />
      <el-table-column prop="TA_Command" label="TA Command" />
      <el-table-column prop="RealTA" label="Read TA" />
      <el-table-column prop="DistanceToBS" label="距基站距离" />

      <!-- 操作列 -->
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="scope">
          <el-button type="primary" size="small" @click="editRow(scope.$index)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination v-model:current-page="pageNo" v-model:page-size="limit" :page-sizes="[10, 20, 30, 40]"
      :background="true" @current-change="getSpu" @size-change="getchangeSpu"
      layout=" prev, pager, next, jumper,->,sizes,total" :total="total" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import axios from 'axios'
const tableData = ref([])
const tableRef = ref(null)
const multipleSelection = ref([])
const pageNo = ref(1)
const limit = ref(10)
const total = ref(0)
// 筛选条件
const filters = ref({
  search: '',
  networkType: '',
  scs: '',
  startDate: null,
  endDate: null,
})
const paginatedData = computed(() => {
  const start = (pageNo.value - 1) * limit.value
  const end = start + limit.value
  return tableData.value.slice(start, end) // 只返回当前页的数据
})

const generateData = async () => {
  const res = await axios.get('/api/table/list')
  if (res.data.code === 200) {
    tableData.value = res.data.data
    console.log(tableData.value)
    total.value = tableData.value.length
  }
}

onMounted(() => {
  generateData()
})

// 清除筛选
const resetFilters = () => {
  filters.value = {
    search: '',
    networkType: '',
    scs: '',
    startDate: null,
    endDate: null,
  }
}


const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
//暴露给父组间去获取到选中的行去导出
const getSelectedRows = () => {
  return multipleSelection.value
}
//暴露给子组件进行追加数据
const appendData = (newData) => {
  tableData.value = tableData.value.concat(newData)
  total.value = tableData.value.length
}
//批量删除
const deleteSelectedRows = () => {
  const selectedIndexes = multipleSelection.value.map(item => tableData.value.indexOf(item))

  selectedIndexes.sort((a, b) => b - a).forEach(index => {
    tableData.value.splice(index, 1)
  })
  total.value = tableData.value.length

  tableRef.value.clearSelection()
}
defineExpose({
  getSelectedRows, appendData, deleteSelectedRows
})

// 编辑/删除
const editRow = (index) => {
  const row = tableData.value[index]
  alert(`编辑: ${row.cellId}`)
}

const deleteRow = (index) => {
  ElMessageBox.confirm(
    '确定要删除这条记录吗？',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      // 用户确认删除
      tableData.value.splice(index, 1)
      total.value = tableData.value.length
      ElMessage.success('删除成功')
    })
    .catch(() => {
      // 用户取消删除
      ElMessage.info('已取消删除')
    })
}
</script>

<style scoped>
.filter-form {
  margin-bottom: 10px;
}
</style>
