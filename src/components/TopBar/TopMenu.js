import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { getMenuRect, getSystemInfo } from '../../utils/index'

export default class TopMenu extends Component {
  constructor(props) {
    super(props)
  }
  static defaultProps = {
    icon: 'chevron-left'
  }

  render() {
    const menuRect = getMenuRect()
    const systemInfo = getSystemInfo()
    const padding = systemInfo.screenWidth - menuRect.right
    const menuStyle = {
      position: 'fixed',
      width: menuRect.height + 'px',
      height: menuRect.height + 'px',
      top: menuRect.top - padding + 'px',
      left: 0,
      padding: padding + 'px',
      zIndex: 101
    }

    const iconStyle = {
      width: menuRect.height + 'px',
      height: menuRect.height + 'px',
      lineHeight: menuRect.height + 'px',
      boxSizing: 'border-box',
      padding: 0,
      fontWeight: 600,
      textAlign: 'center',
      background: 'rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.25)',
      borderRadius: '50%'
    }

    return (
      <View style={menuStyle} onClick={this.props.onClickMenu}>
        <AtIcon
          customStyle={iconStyle}
          value={this.props.icon} //'chevron-left'
          size={20}
          color='#fff'
        />
      </View>
    )
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
}
