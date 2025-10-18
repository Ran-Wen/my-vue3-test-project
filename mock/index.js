import Mock from 'mockjs'
import treeMock from './treeData'
import tableMock from './tableData'

const mocks= [...treeMock,...tableMock]
export function setupMock() {

  // 遍历注册所有 mock 接口
  mocks.forEach((item) => {
    Mock.mock(item.url, item.method || 'get', item.response)
  })
}