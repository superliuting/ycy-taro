import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import Index from './pages/index'

import { loadSystemInfo, loadStatus } from './utils/index'
import { loadUserInfo } from './utils/user'
import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  config = {
    pages: ['pages/index/index', 'pages/about/index'],
    window: {
      navigationStyle: 'custom',
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#cba7f9',
      navigationBarTitleText: '村花杨老师',
      navigationBarTextStyle: 'white',
      enablePullDownRefresh: false
    },
    plugins: {
      htmltowxml: {
        version: '1.3.1',
        provider: 'wxa51b9c855ae38f3c'
      }
    }
  }

  componentDidMount() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      const isDev = process.env.NODE_ENV === 'development'
      wx.cloud.init({
        env: isDev ? 'test-bdc62f' : 'prod-a10476',
        traceUser: true
      })
      loadStatus()
      loadSystemInfo()
      loadUserInfo()
    }
  }

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />
  }
}

Taro.render(<App />, document.getElementById('app'))
