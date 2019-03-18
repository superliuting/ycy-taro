import Taro, { Component } from '@tarojs/taro'
import { Swiper, SwiperItem, View, Image } from '@tarojs/components'
import { getAppConfig } from '../../utils/index'

import './ImageSwiper.scss'

export default class SwiperItemList extends Component {
  constructor(props) {
    super(props)
    // this.state = {
    //   imageIndex: 0
    // }
  }
  static defaultProps = {
    imageIndex: 0,
    imageList: []
  }
  onChange() {
    this.props.onChange()
  }
  onFinish(e) {
    let imageIndex = this.props.imageIndex
    const imageLength = this.props.imageList.length
    const swipterIndex = this.getSwipterIndex(imageLength, imageIndex)
    const offset = e.detail.current - swipterIndex
    if (offset === 0) return
    if (offset === 1 || offset < -1) {
      imageIndex = imageIndex + 1 //上拉
    } else if (offset === -1 || offset > 1) {
      imageIndex = imageIndex - 1 // 下拉
    }

    this.props.onUpdateIndex(imageIndex)
    this.props.onFinish()
  }
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.imageIndex !== this.props.imageIndex ||
      nextProps.imageList.length !== this.props.imageList.length
    )
  }
  getSwipterLength(imageLength, imageIndex) {
    if (imageLength <= 3) return imageLength
    if (imageLength % 3 === 1) {
      if (imageIndex === imageLength - 1 || imageIndex === imageLength - 2) {
        return 4
      }
    } else if (imageLength % 3 === 2) {
      if (imageIndex === imageLength - 1 || imageIndex === imageLength - 2) {
        return 5
      } else if (imageIndex === imageLength - 3) {
        return 4
      }
    }
    return 3
  }
  getSwipterIndex(imageLength, imageIndex) {
    if (imageLength <= 3) return imageIndex
    if (imageLength % 3 === 1) {
      if (imageIndex === imageLength - 1) {
        return 3
      }
    } else if (imageLength % 3 === 2) {
      if (imageIndex === imageLength - 1) {
        return 4
      } else if (imageIndex === imageLength - 2) {
        return 3
      }
    }
    return imageIndex % 3
  }
  getSwipterList(swipterLength, swipterIndex, imageLength, imageIndex) {
    const arr = []
    for (let i = 0; i < swipterLength; i++) {
      const index = (swipterIndex + i) % swipterLength
      const value = i <= 1 ? imageIndex + i : imageIndex + i - swipterLength
      arr[index] = (imageLength + value) % imageLength
    }
    return arr
  }
  preview(url) {
    Taro.previewImage({
      current: '', // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  }
  render() {
    const { imageIndex, imageList } = this.props
    const imageLength = imageList.length
    const swipterLength = this.getSwipterLength(imageLength, imageIndex)
    const swipterIndex = this.getSwipterIndex(imageLength, imageIndex)
    const swipterList = this.getSwipterList(
      swipterLength,
      swipterIndex,
      imageLength,
      imageIndex
    )
    console.log(swipterList)
    const circular = imageIndex > 0 && imageIndex < imageLength - 1
    const config = getAppConfig()

    return (
      <Swiper
        vertical
        duration={300}
        circular={circular}
        onChange={this.onChange}
        onAnimationfinish={this.onFinish}
        current={swipterIndex}
      >
        {swipterList.map((item, index) => {
          const { fileid, name, nickName, avatarUrl } = imageList[item]
          return (
            <SwiperItem key={String(index)}>
              <Image
                className='image image-bg'
                mode='scaleToFill'
                src={fileid}
              />
              <Image
                className='image'
                mode='widthFix'
                src={fileid}
                onClick={() => this.preview(fileid)}
              />
              {config.showUpload && (
                <View className='imageInfo'>
                  <Image className='avatar' src={avatarUrl} />
                  <View className='nickName'>@{nickName}</View>
                  <View className='name'>{name}</View>
                </View>
              )}
            </SwiperItem>
          )
        })}
      </Swiper>
    )
  }

  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentWillUpdate() {}

  componentDidUpdate() {}

  componentDidHide() {}
}
