import {observable, action, computed} from 'mobx'
import fetch from 'better-fetch'

import {PORTRAIT, CLIENT_ID, IMGUR_API as api} from './Constants'


import {createLogger, echo} from './utils'

const IMGUR_URL = 'https://api.imgur.com/3/'

const {log,err} = createLogger('Store')

fetch.setDefaultHeaders({
  Authorization: `Client-ID ${CLIENT_ID}`
})

class Store {
  @observable orientation = PORTRAIT
  @observable images = []
  @observable index = 0
  @observable galleryPage = 0
  @observable albums = new observable.map()
  @observable screenSize = {
    width: null,
    height: null
  }

  @action changeOrientation(orientation) {
    this.orientation = orientation
  }

  @action updateScreenSize(width, height) {
    this.screenSize.width = width
    this.screenSize.height = height
  }

  @action prevImage() {
    this.index = this.index - 1
    if(this.index < 1) {
      this.index = 0
    }
  }

  @action nextImage() {
    this.index = this.index + 1;
    if (this.index > this.images.length) {
      this.galleryPage = this.galleryPage + 1;
      this.fetchImages();
    }
  }

  @action fetchImages() {
    const url = `${api}gallery/hot/viral/${this.galleryPage}`
    log('fetch-images:', url)
    fetch(url)
      .then(res => res.json())
      .then(json => {
        log('images json:', json)
        return json
      })
      .then(json => json.data.forEach(img => this.images.push(img)))
      .catch(e => err(e.message, e))
  }

  @action fetchAlbum(id) {
    log('fetch-album:', id)
    if (!this.albums.has(id)) {
      fetch(`${api}album/${id}`)
        .then(res => res.json())
        .then(json => {
            this.albums.set(json.data.id, json.data);
        })
        .catch(e => err(e.message, e));
    }
  }

  @computed get currentImage() {
    return this.images.length ? this.images[this.index] : null
  }
}
export default new Store()
