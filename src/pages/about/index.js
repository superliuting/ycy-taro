import Taro, { Component } from '@tarojs/taro'
import { View, Image, Textarea, Block, Button } from '@tarojs/components'
import { AtButton, AtCard, AtIcon } from 'taro-ui'

import TopMenu from '../../components/TopBar/TopMenu'
import TopTitle from '../../components/TopBar/TopTitle'
import { uploadYCY, saveYcy } from '../../utils/image'
import { getAboutData, getMenuRect, getSystemInfo } from '../../utils/index'

import iconSmile from '../../assert/smile-green.png'
import iconFail from '../../assert/fail-red.png'

import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '关于小程序',
    // usingComponents: {
    //   wemark: '../../wemark/wemark'
    // }
    usingComponents: {
      htmltowxml: 'plugin://htmltowxml/view'
    }
  }
  constructor(props) {
    super(props)
  }
  state = {
    mode: 'about',
    data: '',
    fileid: '',
    value: ''
  }
  handleChange(event) {
    this.setState({
      value: event.target.value
    })
  }
  onClickMenu() {
    Taro.navigateBack()
  }
  async getAboutInfo() {
    Taro.showLoading({
      title: '正在加载'
    })
    try {
      const data = await getAboutData()
      this.setState({
        data
      })
      Taro.hideLoading()
    } catch (err) {
      console.error(err)
      Taro.hideLoading()
    }
  }
  async onUploadFile() {
    try {
      const res = await uploadYCY()
      this.setState({
        mode: 'success',
        fileid: res.fileid
      })
    } catch (error) {
      this.setState({
        mode: 'fail',
        fileid: error.fileid
      })
    }
  }
  async onConfirm() {
    try {
      const data = {
        name: this.state.value,
        fileid: this.state.fileid
      }
      await saveYcy(data)
      // Taro.navigateBack()
      Taro.reLaunch({
        url: '/pages/index/index'
      })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { mode, data, fileid, value } = this.state
    const menuRect = getMenuRect()
    const systemInfo = getSystemInfo()
    const padding = systemInfo.screenWidth - menuRect.right
    const topbarStyle = {
      position: 'fixed',
      height: menuRect.height + 'px',
      lineHeight: menuRect.height + 'px',
      right: padding + 'px',
      top: menuRect.top + menuRect.height + 2 * padding + 'px',
      zIndex: 100
    }

    return (
      <View className='about'>
        <TopMenu onClickMenu={this.onClickMenu} />
        <TopTitle title={mode === 'about' ? '关于' : ''} />
        {mode === 'about' && (
          <Block>
            <htmltowxml
              type='markdown'
              showLoading={false}
              padding={0}
              text={data}
            />
            <Button className='btn' style={topbarStyle} open-type='contact'>
              <AtIcon value='help' size={menuRect.height} color='#cba7f9' />
            </Button>
          </Block>
        )}

        {mode === 'success' && (
          <Block>
            <AtCard
              className='card'
              extra=''
              title='照片验证通过'
              thumb={iconSmile}
            >
              <Textarea
                className='at-textarea__textarea'
                autoFocus
                focus
                maxLength={100}
                value={value}
                placeholder='添加一些描述...'
                onInput={this.handleChange.bind(this)}
              />
            </AtCard>
            {fileid && (
              <View className='image-view'>
                <Image className='image' mode='widthFix' src={fileid} />
              </View>
            )}
            <View className='action'>
              <AtButton type='secondary' onClick={this.onClickMenu}>
                取 消
              </AtButton>
              <AtButton type='primary' onClick={this.onConfirm}>
                立即发布
              </AtButton>
            </View>
          </Block>
        )}

        {mode === 'fail' && (
          <Block>
            <AtCard
              className='card'
              note='请检查上传要求并重试'
              extra=''
              title='照片验证未通过'
              thumb={iconFail}
            >
              <View>1. 仅支持 .jpg 和 .png 格式，且大小不超过 20Mb</View>
              <View>2. 照片中需要包含村花清晰的正脸</View>
              <View>3. 照片中只能包含村花一人的正脸</View>
            </AtCard>
            {fileid && (
              <View className='image-view'>
                <Image className='image' mode='widthFix' src={fileid} />
              </View>
            )}
            <View className='action'>
              <AtButton type='secondary' onClick={this.onClickMenu}>
                取 消
              </AtButton>
              <AtButton type='primary' onClick={this.onUploadFile}>
                重新上传
              </AtButton>
            </View>
          </Block>
        )}
      </View>
    )
  }

  componentWillMount() {
    const { mode, fileid } = this.$router.params
    if (mode && fileid) {
      this.setState({
        mode: mode,
        fileid: fileid
      })
    } else {
      this.setState({
        mode: 'about'
      })
      this.getAboutInfo()
    }
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
}
