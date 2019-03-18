import Taro, { Component } from '@tarojs/taro'
import { View, Block } from '@tarojs/components'
import { getMenuRect } from '../../utils/index'
import ImageSwiper from './ImageSwiper'
import './index.scss'

export default class ImageView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      moving: false
    }
  }
  static defaultProps = {
    imageIndex: 0,
    imageList: []
  }
  onChange() {
    this.setState({
      moving: true
    })
  }
  onFinish() {
    this.setState({
      moving: false
    })
  }
  render() {
    const moving = this.state.moving
    const { imageIndex, imageList } = this.props
    const menuRect = getMenuRect()

    return (
      <Block>
        {imageList.length && (
          <View
            className='nomore'
            style={{
              top: menuRect.top + menuRect.height + 10 + 'px'
            }}
          >
            没有更多了~
          </View>
        )}
        {imageList.length && (
          <View
            className='nomore'
            style={{
              bottom: 5 + 'px'
            }}
          >
            没有更多了~
          </View>
        )}
        <ImageSwiper
          imageIndex={imageIndex}
          imageList={imageList}
          onUpdateIndex={this.props.onUpdateIndex}
          onListImages={this.props.onListImages}
          onChange={this.onChange}
          onFinish={this.onFinish}
        />
        {moving && (
          <View
            className='mask'
            onTouchmove={e => {
              e.stopPropagation()
            }}
          />
        )}
      </Block>
    )
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
}
