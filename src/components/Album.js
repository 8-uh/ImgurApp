import React, {Component} from 'react'
import {
  ListView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight
} from 'react-native'

import {toJS} from 'mobx'
import {inject, observer} from 'mobx-react/native'

import styles from './styles'
import Spinner from './Spinner'
import TouchableImage from './TouchableImage'

import {createLogger} from 'src/utils'

const {log, warn, err} = createLogger('Album')

@inject('store') @observer
class Album extends Component {
  componentWillMount() {
    const {store, albumID} = this.props
    store.fetchAlbum(albumID)
    log('mounted')
  }

  componentWillReceiveProps(newProps) {
    log('willReceiveProps', newProps)
    const {store, albumID} = newProps
    store.fetchAlbum(albumID)
  }

  get dataSource() {
    log('get-dataSource')
    const {store, albumId} = this.props
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1.id !== r2.id
    })
    log('get-dataSource ds:', ds)
    const dsclone = ds.cloneWithRows(toJS(this.album.images))
    log('get-dataSource dsclone:', dsclone)
    return dsclone
  }

  get album() {
    log('get-album')
    const {store, albumID} = this.props
    log('get-album albumID', albumID)
    return store.albums.get(albumID)
  }

  renderRow(img, caption) {
    log('render-row', img, caption)
    const {store} = this.props
    let height = store.screenSize.height
    if(img.height < height) {
      height = img.height
    }
    log('render-row height', height)
    return (
      <TouchableImage image={img} height={height} caption={caption} />
    )
  }

  renderHeader() {
    log('render-header')
    return (
      <Text style={styles.header}>{this.album.title}</Text>
    )
  }

  render() {
    const {store, albumID} = this.props
    const album = this.album
    if(album) {
      if(album.images.length > 1) {
        return (
          <View style={styles.fullscreen}>
            <ListView
              dataSource={this.dataSource}
              renderRow ={img => this.renderRow(img)}
              renderHeader={() => this.renderHeader()}
              style={styles.fullscreen}
            />
          </View>
        )
      } else {
        return this.renderRow(album.images[0], album.title)
      }
    } else {
      return null
    }
  }
}

export default Album
