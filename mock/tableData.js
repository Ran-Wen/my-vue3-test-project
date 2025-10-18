import Mock from 'mockjs'

function generateData() {
  const data = []
  for (let i = 1; i <= 200; i++) {
    data.push(Mock.mock({
      CellIdentity: '@integer(1000, 9999)',
      BS_ID: '@integer(100, 999)',
      Datatime: '@datetime("yyyy-MM-dd HH:mm:ss")',
      Longitude: '@float(116,117,6,6)',
      Latitude: '@float(39,41,6,6)',
      MCC: 0,
      MNC: 0,
      NetworkType: '@pick(["4G","5G"])',
      SCS: '@pick(["15","30"])',
      RSRP: '@integer(-120,-60)',
      DL_Frequency: '@integer(18000,20000)',
      PRACH_TA: '@integer(0,255)',
      TA_Command: '@integer(0,255)',
      RealTA: '@integer(0,255)',
      DistanceToBS: '@float(0,5000,0,2)',
    }))
  }
  return data
}



export default [
  {
    url: '/api/table/list',
    method: 'get',
    response: () => {
      const tableData = generateData()
      return {
        code: 200,
        data: tableData,
      }
    },
  },
]
