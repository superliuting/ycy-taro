import Taro from '@tarojs/taro'
import { setGlobalData, getGlobalData } from './global'

export function getUserByOpenid(openid) {
  // 调用云函数
  return wx.cloud
    .callFunction({
      name: 'user',
      data: {
        action: 'getUserByOpenid',
        openid: openid
      }
    })
    .then(res => {
      const data = res.result
      if (data.length > 0) {
        return data[0]
      }
      return {}
    })
    .catch(err => {
      console.error(err)
    })
}

export function loadUserInfo() {
  return wx.cloud
    .callFunction({
      name: 'user',
      data: {
        action: 'getUser'
      }
    })
    .then(res => {
      const data = res.result
      if (data.length > 0) {
        setGlobalData('userInfo', data[0])
        return data[0]
      }
    })
    .catch(err => {
      console.error(err)
    })
}

export function saveUserInfo(e) {
  return new Promise((resolve, reject) => {
    const userInfo = getGlobalData('userInfo')
    if (userInfo.nickName) {
      resolve(userInfo)
      return
    }
    if (!e.detail.userInfo) {
      Taro.showToast({
        title: '请同意授权后继续操作',
        icon: 'none'
      })
      reject('用户拒绝授权')
      return
    }

    wx.cloud
      .callFunction({
        name: 'user',
        data: {
          action: 'addUser',
          userData: e.detail.userInfo
        }
      })
      .then(async () => {
        const userinfo = await loadUserInfo()
        resolve(userinfo)
      })
      .catch(err => {
        console.error(err)
        reject(err)
      })
  })
}
