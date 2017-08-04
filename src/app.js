import React, {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native'

import {Provider as MobXProvider, observer} from 'mobx-react/native'
import {spy, toJS} from 'mobx'

import ImgurCarousel from './components/ImgurCarousel'
import {LANDSCAPE, PORTRAIT} from './Constants'
import Store from './Store'

spy(event => {
  const {name, type, arguments:args, fn} = event
  if(['action'].includes(type) && name) {
    console.log('[spy]:',name, type, args)
  }

})

@observer
class ImgurApp extends Component {

  componentWillMount() {
    Store.fetchImages()
  }

  onLayout(event) {
    const {width, height} = event.nativeEvent.layout
    const orientation = (width > height) ? LANDSCAPE : PORTRAIT

    Store.changeOrientation(orientation)
    Store.updateScreenSize(width, height)
  }


  render() {
    return (
      <MobXProvider store={Store}>
        <View
          style={styles.container}
          onLayout={evt => this.onLayout(evt)}
        >
          <ImgurCarousel/>
        </View>
      </MobXProvider>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  }
})

AppRegistry.registerComponent('ImgurApp', () => ImgurApp)

export default ImgurApp
