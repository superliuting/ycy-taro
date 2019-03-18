import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import './index.scss'

export default class User extends Component {
  // config = {
  //   navigationBarTitleText: '首页'
  // }

  render() {
    return <View className='user'>user/index</View>
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
}
