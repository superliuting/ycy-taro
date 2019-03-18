// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: process.env.CLOUD_ENV
})
const db = cloud.database()

async function addUser(openid, userData) {
  try {
    const res = await db
      .collection('users')
      .where({
        openid: openid
      })
      .limit(1)
      .get()

    if (res.data.length > 0) {
      return {
        errMsg: '已存在',
        _id: res.data[0]._id
      }
    }

    const data = {
      openid: openid,
      ...userData,
      createTime: db.serverDate()
    }
    return await db.collection('users').add({
      data: data
    })
  } catch (e) {
    console.error(e)
  }
}

async function getUser(openid) {
  try {
    const res = await db
      .collection('users')
      .where({
        openid: openid
      })
      .limit(1)
      .get()
    return res.data
  } catch (e) {
    console.error(e)
  }
}

// 云函数入口函数
exports.main = async event => {
  console.log('user event', event)
  const { OPENID } = cloud.getWXContext()
  const action = event.action

  switch (action) {
  case 'addUser':
    return addUser(OPENID, event.userData)

  case 'getUser':
    return getUser(OPENID)

  case 'getUserByOpenid':
    return getUser(event.openid)

  default:
    break
  }
}
