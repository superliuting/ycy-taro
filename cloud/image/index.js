const cloud = require('wx-server-sdk')
const faceClient = require('./face.js')

cloud.init({
  env: process.env.CLOUD_ENV
})
const db = cloud.database()
const _ = db.command

async function getTempFileURL(fileList) {
  if (!fileList.length) {
    return {
      errMsg: '获取图片链接失败'
    }
  }
  const res = await cloud.getTempFileURL({
    fileList
  })
  const files = res.fileList
  return files.map(file => file.tempFileURL)
}

async function saveImages(imageInfo) {
  const { OPENID } = cloud.getWXContext()
  try {
    const data = {
      openid: OPENID,
      ...imageInfo,
      createTime: db.serverDate()
    }
    return await db.collection('images').add({
      data: data
    })
  } catch (e) {
    console.error(e)
  }
}

async function listImages() {
  try {
    const result1 = await db
      .collection('images_ycy')
      .orderBy('createTime', 'desc')
      .get()
    const list = result1.data
    const openids = list.map(item => item.openid)
    const result2 = await db
      .collection('users')
      .field({
        avatarUrl: true,
        nickName: true,
        openid: true
      })
      .where({
        openid: _.in([...new Set(openids)])
      })
      .get()
    const users = result2.data
    return list.map(item => {
      const user = users.find(u => u.openid === item.openid)
      return user ? { ...item, ...user } : item
    })
  } catch (e) {
    console.error(e)
  }
}

async function verifyFace(fileid) {
  if (!fileid) {
    return {
      errMsg: '获取图片链接失败'
    }
  }
  const urlList = await getTempFileURL([fileid])
  if (!urlList.length) {
    return {
      errMsg: '获取图片链接失败'
    }
  }
  const data = await faceClient.verify(urlList[0])
  // Score, IsMatch
  const imageInfo = {
    fileid: fileid,
    Score: data.Score,
    IsMatch: data.IsMatch
  }
  await saveImages(imageInfo)
  return imageInfo
}

async function saveYcy(imageInfo) {
  const { OPENID } = cloud.getWXContext()
  try {
    const data = {
      openid: OPENID,
      ...imageInfo,
      like: 0,
      createTime: db.serverDate()
    }
    return await db.collection('images_ycy').add({
      data: data
    })
  } catch (e) {
    console.error(e)
  }
}

exports.main = event => {
  console.log('image event', event)
  const action = event.action
  switch (action) {
  case 'listImages':
    return listImages()

  case 'verifyFace':
    return verifyFace(event.fileid)

  case 'saveYcy':
    return saveYcy(event.imageInfo)

  default:
    break
  }
}
