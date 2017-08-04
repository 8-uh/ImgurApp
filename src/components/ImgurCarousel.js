import React, {Component} from 'react'
import TouchableImage from './TouchableImage'
import {inject, observer} from 'mobx-react/native'
import Spinner from './Spinner'
import Album from './Album'
import styles from './styles'


@inject('store') @observer
class ImgurCarousel extends Component {
  render() {
    const {store} = this.props
    if(!store.currentImage) {
      return (<Spinner />)
    }
    if(store.currentImage.is_album) {
      return (
        <Album albumID={store.currentImage.id} />
      )
    } else {
      return (
        <TouchableImage
          image={store.currentImage}
        />
      )
    }

  }
}

export default ImgurCarousel
