import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

import TopMenu from '../../components/TopBar/TopMenu'
// import TopTitle from '../../components/TopBar/TopTitle'
import ImageSwiper from '../../components/ImageView'

import { getAppConfig } from '../../utils/index'
import { saveUserInfo } from '../../utils/user'
import { uploadYCY, listImages } from '../../utils/image'

import './index.scss'

export default class Index extends Component {
  // config = {
  //   navigationBarTitleText: '首页'
  // }
  constructor(props) {
    super(props)
    this.state = {
      imageIndex: 0,
      imageList: []
    }
  }

  onUpdateIndex(imageIndex) {
    this.setState({
      imageIndex: imageIndex
    })
  }

  async onListImages() {
    try {
      const imageList = await listImages()
      this.setState({
        imageIndex: 0,
        imageList: imageList
      })
    } catch (error) {
      console.error(error)
    }
  }

  async onUploadFile() {
    try {
      const res = await uploadYCY()
      console.log(res)
      Taro.navigateTo({
        url: '/pages/about/index?mode=success&fileid=' + res.fileid
      })
    } catch (error) {
      Taro.navigateTo({
        url: '/pages/about/index?mode=fail&fileid=' + error.fileid
      })
    }
  }
  onOpen() {
    Taro.navigateTo({
      url: '/pages/about/index?mode=about'
    })
  }

  handleUpload(e) {
    saveUserInfo(e)
      .then(() => {
        this.onUploadFile()
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    const { imageIndex, imageList } = this.state
    const config = getAppConfig()
    return (
      <View className='index'>
        {config.showMenu && <TopMenu icon='sketch' onClickMenu={this.onOpen} />}
        {/* {!config.showUpload && <TopTitle title='村花相册' position='fixed' />} */}

        <ImageSwiper
          imageIndex={imageIndex}
          imageList={imageList}
          onUpdateIndex={this.onUpdateIndex}
          onListImages={this.onListImages}
        />
        {config.showUpload && (
          <Button
            className='btn-upload'
            openType='getUserInfo'
            onGetuserinfo={this.handleUpload}
          >
            上传村花
          </Button>
        )}
      </View>
    )
  }
  onShareAppMessage(res) {
    console.log(res)
    return {
      title: '村花杨老师',
      path: '/pages/index/index'
    }
  }

  componentWillMount() {}

  componentDidMount() {
    this.onListImages()
  }
  shouldComponentUpdate() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}
}
