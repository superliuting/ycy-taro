import { setGlobalData, getGlobalData } from './global'

export function loadSystemInfo() {
  const menuRect = wx.getMenuButtonBoundingClientRect()
  setGlobalData('menuRect', menuRect)
  // console.log(menuRect)
  const systemInfo = wx.getSystemInfoSync()
  setGlobalData('systemInfo', systemInfo)
  // console.log(systemInfo)
}

export function getMenuRect() {
  return getGlobalData('menuRect') || {}
}

export function getSystemInfo() {
  return getGlobalData('systemInfo') || {}
}

export function loadStatus() {
  return wx.cloud
    .callFunction({
      name: 'app',
      data: {
        action: 'getAppConfig'
      }
    })
    .then(res => {
      console.log(res)
      const status = res.result
      setGlobalData('status', status)
    })
    .catch(err => {
      console.error(err)
    })
}

export function getAppConfig() {
  return getGlobalData('status')
}

export function getAboutData() {
  // 调用云函数
  return wx.cloud
    .callFunction({
      name: 'app',
      data: {
        action: 'getAboutData'
      }
    })
    .then(res => {
      return res.result
    })
    .catch(err => {
      console.error(err)
    })
}
