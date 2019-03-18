import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { getMenuRect, getSystemInfo } from '../../utils/index'

export default class TopTitle extends Component {
  constructor(props) {
    super(props)
  }
  static defaultProps = {
    title: '',
    position: 'static'
  }

  render() {
    const menuRect = getMenuRect()
    const systemInfo = getSystemInfo()
    const padding = systemInfo.screenWidth - menuRect.right
    const topbarStyle = {
      position: this.props.position,
      height: menuRect.height + 'px',
      paddingTop: menuRect.top + 'px',
      paddingBottom: padding + 'px',
      zIndex: 100
    }

    const titleStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      color: '#fff',
      background: '#cba7f9',
      textAlign: 'center',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      zIndex: 100,

      height: menuRect.height + 'px',
      lineHeight: menuRect.height + 'px',
      fontSize: menuRect.height / 2 + 'px',
      padding: padding + 'px',
      paddingTop: menuRect.top + 'px'
    }

    return (
      <View style={topbarStyle}>
        <View style={titleStyle}>{this.props.title}</View>
      </View>
    )
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
}
