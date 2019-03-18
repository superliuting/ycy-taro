// 云函数入口文件
const cloud = require('wx-server-sdk')
const fs = require('fs')
const path = require('path')

cloud.init({
  env: process.env.CLOUD_ENV
})

function readFile(filePath) {
  return new Promise(async (resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

async function getAboutData() {
  try {
    const filePath = path.join(__dirname, 'about.md')
    return await readFile(filePath)
  } catch (err) {
    console.log('Error', err)
  }
}

function getAppConfig() {
  return {
    showMenu: process.env.SHOW_MENU === 'TRUE',
    showUpload: process.env.SHOW_UPLOAD === 'TRUE'
  }
}

exports.main = event => {
  console.log('image event', event)
  const action = event.action
  switch (action) {
  case 'getAboutData':
    return getAboutData()

  case 'getAppConfig':
    return getAppConfig()

  default:
    break
  }
}
