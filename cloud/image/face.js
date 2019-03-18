const tencentcloud = require('tencentcloud-sdk-nodejs')
// const { SecretId, SecretKey } = require('./config.js')
const { TXY_SECRETID, TXY_SECRETKEY, TXY_PERSONID } = process.env

const IaiClient = tencentcloud.iai.v20180301.Client
const models = tencentcloud.iai.v20180301.Models

const Credential = tencentcloud.common.Credential
const ClientProfile = tencentcloud.common.ClientProfile
const HttpProfile = tencentcloud.common.HttpProfile

let cred = new Credential(TXY_SECRETID, TXY_SECRETKEY)
let httpProfile = new HttpProfile()
httpProfile.endpoint = 'iai.tencentcloudapi.com'
let clientProfile = new ClientProfile()
clientProfile.httpProfile = httpProfile
let client = new IaiClient(cred, 'ap-shanghai', clientProfile)

exports.verify = url => {
  const params = {
    PersonId: TXY_PERSONID,
    Url: url
  }
  let req = new models.VerifyFaceRequest()
  req.from_json_string(JSON.stringify(params))
  return new Promise(resolve => {
    client.VerifyFace(req, (errMsg, response) => {
      if (errMsg) {
        console.log(errMsg)
        resolve(errMsg)
      }
      // console.log(response.to_json_string())
      resolve(response)
    })
  })
}
