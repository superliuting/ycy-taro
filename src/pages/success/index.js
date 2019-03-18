import Taro, { Component } from '@tarojs/taro'
import { View, Image, Textarea } from '@tarojs/components'
import { AtButton, AtCard } from 'taro-ui'

import TopMenu from '../../components/TopBar/TopMenu'
import TopTitle from '../../components/TopBar/TopTitle'
import failImg from '../../assert/smile-green.png'
import { saveYcy } from '../../utils/image'

import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '上传成功'
  }
  constructor(props) {
    super(props)
    this.state = {
      fileid: '',
      value: ''
    }
  }
  onClickMenu() {
    Taro.navigateBack()
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
  handleChange(event) {
    this.setState({
      value: event.target.value
    })
  }
  render() {
    const { fileid, value } = this.state
    return (
      <View className='success'>
        <TopMenu onClickMenu={this.onClickMenu} />
        <TopTitle title='' />

        <AtCard
          className='textarea'
          extra=''
          title='照片验证通过'
          thumb={failImg}
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

        <Image className='image' mode='widthFix' src={fileid} />
        <View className='action'>
          <AtButton type='secondary' onClick={this.onClickMenu}>
            取 消
          </AtButton>
          <AtButton type='primary' onClick={this.onConfirm}>
            立即发布
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
