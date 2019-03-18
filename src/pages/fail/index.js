import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton, AtCard } from 'taro-ui'

import TopMenu from '../../components/TopBar/TopMenu'
import TopTitle from '../../components/TopBar/TopTitle'
import { uploadYCY } from '../../utils/image'

import failImg from '../../assert/fail-red.png'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '上传失败'
  }
  constructor(props) {
    super(props)
    this.state = {
      fileid: ''
    }
  }
  onClickMenu() {
    Taro.navigateBack()
  }
  async onUploadFile() {
    try {
      const res = await uploadYCY()
      Taro.redirectTo({
        url: '/pages/success/index?fileid=' + res.fileid
      })
    } catch (error) {
      this.setState({
        fileid: error.fileid
      })
    }
  }
  render() {
    const { fileid } = this.state
    return (
      <View className='fail'>
        <TopMenu onClickMenu={this.onClickMenu} />
        <TopTitle title='' />
        <AtCard
          className='textarea'
          note='请检查上传要求并重试'
          extra=''
          title='照片验证未通过'
          thumb={failImg}
        >
          <View>1. 仅支持 .jpg 和 .png 格式，且大小不超过 20Mb</View>
          <View>2. 照片中需要包含村花清晰的正脸</View>
          <View>3. 照片中只能包含村花一人的正脸</View>
        </AtCard>
        {fileid && <Image className='image' mode='widthFix' src={fileid} />}
        <View className='action'>
          <AtButton type='secondary' onClick={this.onClickMenu}>
            取 消
          </AtButton>
          <AtButton type='primary' onClick={this.onUploadFile}>
            重新上传
          </AtButton>
        </View>
      </View>
    )
  }

  componentWillMount() {
    const { fileid } = this.$router.params
    if (fileid) {
      this.setState({
        fileid: fileid
      })
    } else {
      Taro.reLaunch({
        url: '/pages/index/index'
      })
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
}
