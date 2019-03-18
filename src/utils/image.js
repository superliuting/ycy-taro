import Taro from '@tarojs/taro'

function chooseImage() {
  // 从相册和相机中获取图片
  return Taro.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera']
  })
    .then(res => {
      return res.tempFilePaths[0]
    })
    .catch(err => {
      console.log(err)
    })
}

function uploadFile(filePath) {
  if (!filePath) return
  const fileType = filePath.match(/\.[^.]+?$/)[0]
  const str = Math.random()
    .toString(10)
    .substr(-4)
  const cloudPath = `${Date.now()}-${str}${fileType}`
  Taro.showLoading({
    title: '正在上传'
  })
  return wx.cloud
    .uploadFile({
      cloudPath: cloudPath,
      filePath: filePath
    })
    .then(res => {
      Taro.hideLoading()
      return res.fileID
    })
    .catch(err => {
      console.log(err)
      Taro.hideLoading()
      Taro.showToast({
        title: '上传失败，请重试',
        icon: 'none'
      })
    })
}

function verifyFace(fileid) {
  if (!fileid) return
  Taro.showLoading({
    title: '正在检测'
  })

  return wx.cloud
    .callFunction({
      name: 'image',
      data: {
        action: 'verifyFace',
        fileid: fileid
      }
    })
    .then(res => {
      Taro.hideLoading()
      return res.result
    })
    .catch(err => {
      console.log(err)
      Taro.hideLoading()
    })
}

//上传文件
export function uploadYCY() {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = await chooseImage()
      if (!filePath) return
      const fileID = await uploadFile(filePath)
      if (!fileID) return
      const result = await verifyFace(fileID)
      if (!result) return
      if (result.IsMatch) {
        resolve(result)
      } else {
        reject(result)
      }
    } catch (err) {
      console.log(err)
    }
  })
}

export function listImages() {
  Taro.showLoading({
    title: '正在加载'
  })

  return wx.cloud
    .callFunction({
      name: 'image',
      data: {
        action: 'listImages'
      }
    })
    .then(res => {
      console.log('onListImages', res.result)
      Taro.hideLoading()
      return res.result
    })
    .catch(err => {
      console.error(err)
      Taro.hideLoading()
    })
}

export function saveYcy(imageInfo) {
  return wx.cloud
    .callFunction({
      name: 'image',
      data: {
        action: 'saveYcy',
        imageInfo: imageInfo
      }
    })
    .then(res => {
      return res.result
    })
    .catch(err => {
      console.log(err)
    })
}
