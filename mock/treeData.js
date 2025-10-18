

// 递归创建五层树数据
function createTree(level = 1, maxLevel = 5, parentId = '') {
  if (level > maxLevel) return []
  const children = []
  for (let i = 1; i <= 3; i++) {
    const id = parentId + i
    children.push({
      id,
      label: `节点 ${id}`,
      children: createTree(level + 1, maxLevel, id),
    })
  }
  return children
}

export default [
  {
    url: '/api/tree/list',
    method: 'get',
    response: () => {
      const treeData = createTree(1, 5)
      return {
        code: 200,
        data: treeData,
      }
    },
  },
]
