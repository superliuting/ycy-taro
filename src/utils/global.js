const globalData = {
  status: {
    showMenu: false,
    showUpload: false
  },
  userInfo: {}
}

export function setGlobalData(key, val) {
  globalData[key] = val
}

export function getGlobalData(key) {
  return globalData[key]
}
