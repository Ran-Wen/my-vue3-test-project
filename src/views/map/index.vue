<template>
  <div id="map"></div>
</template>

<script setup>
import { onMounted } from 'vue'

function loadBMap(ak) {
  return new Promise((resolve, reject) => {
    window.initBMap = () => {
      resolve()
      delete window.initBMap
    }

    const script = document.createElement('script')
    script.src = `https://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=initBMap`
    script.onerror = () => reject(new Error('百度地图 SDK 加载失败'))
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  const ak = 'sFbdfgEyYWiJuq5TQ2VmWL68XfNRzK1Y'
  try {
    await loadBMap(ak)

    const BMap = window.BMap
    console.log('BMap:', BMap)
    // 坐标
    const lng = 116.27238836621343
    const lat = 40.04921333266721
    const point = new BMap.Point(lng, lat)

    // 初始化地图
    const map = new BMap.Map('map')
    map.centerAndZoom(point, 15)
    map.enableScrollWheelZoom(true)


    const radii = [200, 400, 600, 800]
    const colors = ['#188b28', '#867e33', '#f7df06', '#f10606']
    const signalRanges = [
      '>= -80 dBm',
      '-80 dBm ~ -90 dBm',
      '-90 dBm ~ -100 dBm',
      '-100 dBm ~ -110 dBm'
    ]
    radii.forEach((radius, i) => {
      const circle = new BMap.Circle(point, radius, {
        strokeColor: colors[i],
        strokeWeight: 1,
        fillColor: colors[i],
        fillOpacity: 0.3
      })
      map.addOverlay(circle)
    })


    const legendContainer = document.createElement('div')
    legendContainer.style.position = 'absolute'
    legendContainer.style.left = '10px'
    legendContainer.style.bottom = '10px'
    legendContainer.style.backgroundColor = 'white'
    legendContainer.style.padding = '5px'
    legendContainer.style.borderRadius = '5px'
    legendContainer.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.3)'
    legendContainer.style.zIndex = '1000'


    const legendTitle = document.createElement('h3')
    legendTitle.textContent = '信号强度范围'
    legendContainer.appendChild(legendTitle)

    // 添加图例项
    radii.forEach((_, i) => {
      const legendItem = document.createElement('div')
      legendItem.style.display = 'flex'
      legendItem.style.alignItems = 'center'
      legendItem.style.margin = '5px 0'

      const colorBox = document.createElement('span')
      colorBox.style.width = '20px'
      colorBox.style.height = '20px'
      colorBox.style.backgroundColor = colors[i]
      colorBox.style.marginRight = '10px'

      const label = document.createElement('span')
      label.textContent = `${signalRanges[i]} (${radii[i]} 米)`

      legendItem.appendChild(colorBox)
      legendItem.appendChild(label)
      legendContainer.appendChild(legendItem)
    })

    // 将图例添加到地图容器
    map.getContainer().appendChild(legendContainer)

    const marker = new BMap.Marker(point)
    map.addOverlay(marker)
  } catch (err) {
    console.error(err)
  }
})
</script>

<style>
#map {
  width: 100%;
  height: 100%;

}
</style>