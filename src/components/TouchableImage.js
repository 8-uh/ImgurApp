import React, {Component} from 'react'
import {TouchableHighlight, Image, Text, View} from 'react-native'
import {inject, observer} from 'mobx-react/native'
import styles from './styles'

@inject('store') @observer
class TouchableImage extends Component {
  state = {
    width: null,
    hideCaption: false
  }
  onPress(event) {
    const {width} = this.state
    const {store} = this.props
    const x = event.nativeEvent.locationX
    if(x < width * 0.3) {
      store.prevImage()
    } else if(x > width * 0.6){
      store.nextImage()
    }
  }
  onPressIn(event) {
    this.setState({
      hideCaption: true
    })
  }
  onPressOut(event) {
    this.setState({
      hideCaption: false
    })
  }
  onImageLayout(event) {
    this.setState({
      width: event.nativeEvent.layout.width
    })
  }
  get caption() {
    const {caption, image} = this.props
    return image.title || image.description || caption
  }

  render() {
    const {image, store, height} = this.props
    const uri = image.link.replace('http://', 'https://')
    const hideCaption = this.stateHideCaption ? styles.hiddenLabel : null

    return (
      <View>
        <TouchableHighlight
          onPress={(evt) => this.onPress(evt)}
          onPressIn={evt => this.onPressIn(evt)}
          onPressOut={evt => this.onPressOut(evt)}
          style = {styles.fullscreen}>
          <Image
            source={{uri}}
            style={[styles.backgroundImage, styles[store.orientation.toLowerCase()],
              {height: height || null}]}
            onLayout={(evt) => this.onImageLayout(evt)}
          >
            {this.caption ?
              <Text style={[styles.imageLabel, hideCaption]}>{this.caption}</Text>
            : null}
          </Image>
        </TouchableHighlight>
      </View>
    )
  }
}

export default TouchableImage
