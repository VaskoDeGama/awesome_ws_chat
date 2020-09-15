'use strict'

import { parseData } from './utils'

export default class Broadcast {
  /**
   * Broadcast constructor
   * @param service
   * @param fps
   * @param videoBoxSelector
   * @param streamBoxSelector
   */
  constructor({ service, fps, videoBoxSelector, streamBoxSelector }) {
    this.service = service
    this.fps = fps
    this.videoBox = document.querySelector(videoBoxSelector)
    this.streamBox = document.querySelector(streamBoxSelector)
    this.snapshotCanvas = null
    this.broadcastCanvas = null
    this.snapshotCtx = null
    this.broadcastCtx = null
    this.img = null
    this.broadcastInterval = null
  }

  camInitialize() {
    const constraints = {
      video: {
        width: { max: 300 },
        height: { max: 300 },
      },
    }
    function hasGetUserMedia() {
      return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    }
    return new Promise((resolve, reject) => {
      if (hasGetUserMedia()) {
        return navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => {
            this.videoBox.srcObject = stream
            this.onLoadedMetaDataEvent = () => resolve(this)
            this.videoBox.addEventListener(
              'loadedmetadata',
              this.onLoadedMetaDataEvent
            )
          })
      } else {
        console.error('getUserMedia() is not supported by your browser')
        reject('getUserMedia() is not supported by your browser')
      }
    })
  }

  /**
   *
   * @param target
   * @param styleData
   * @returns target
   */
  setSize(target, styleData) {
    target.style.width = `${styleData.width} px`
    target.style.height = `${styleData.height} px`
    target.width = styleData.width
    target.height = styleData.height
    target.style.left = `${styleData.left} px`
    target.style.top = `${styleData.top} px`
    return target
  }

  /**
   * Get base64 string from source throw helper canvas
   * @param source
   * @param snapshotContext
   * @param snapshotCanvas
   * @returns {string}
   */
  getSnapshot(source, snapshotContext, snapshotCanvas) {
    snapshotContext.drawImage(source, 0, 0)
    return snapshotCanvas.toDataURL('image/jpeg', 0.1).split(',')[1]
  }

  /**
   * Set base64data to target throw img
   * @param img
   * @param data
   * @param targetCtx
   */
  setSnapshot(data, img = this.img, targetCtx = this.broadcastCtx) {
    img.onload = () => {
      targetCtx.drawImage(img, 0, 0)
    }
    img.src = `data:image/png;base64,${data}`
  }

  /**
   * Initialize helper elements
   * @returns {Broadcast}
   */
  init() {
    try {
      this.snapshotCanvas = document.createElement('canvas')
      this.broadcastCanvas = document.createElement('canvas')
      const vidStyleData = this.videoBox.getBoundingClientRect()
      this.broadcastCanvas.id = 'stream'
      this.snapshotCanvas.id = 'screenshot'
      this.streamBox.appendChild(
        this.setSize(this.snapshotCanvas, vidStyleData)
      )
      this.streamBox.appendChild(
        this.setSize(this.broadcastCanvas, vidStyleData)
      )
      this.snapshotCtx = this.snapshotCanvas.getContext('2d')
      this.broadcastCtx = this.broadcastCanvas.getContext('2d')
      this.img = new Image()

      this.service.addEvent('message', (event) => {
        const { type, message } = parseData(event.data)
        if (type === 'stream') {
          this.setSnapshot(message)
        } else if (type === 'startCast') {
          this.startBroadcast()
          this.iAmOnline()
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  iAmOnline() {
    this.service.send({
      type: 'text',
      message: 'I am online',
      owner: this.service.id,
    })
  }

  /**
   * Start work
   */
  start() {
    this.camInitialize()
      .then((res) => res.init())
      .then(() => {
        if (this.service.canCast) {
          this.startBroadcast()
          console.log('i Am online')
          this.iAmOnline()
          window.addEventListener('beforeunload', () => {
            if (this.service.canCast) {
              this.service.send({
                type: 'casterLeaves',
              })
            }
            this.stop()
          })
        }
      })
      .then(() => {
        //setTimeout(() => this.stop(), 10000)
      })
  }

  /**
   * start broadcast
   */
  startBroadcast() {
    this.broadcastInterval = setInterval(() => {
      const snapshot = this.getSnapshot(
        this.videoBox,
        this.snapshotCtx,
        this.snapshotCanvas
      )
      this.service.send({ type: 'stream', message: snapshot })
    }, 1000 / this.fps)
  }

  /**
   * Stop broadcasting
   */
  stop() {
    console.log('i am  offline')
    this.videoBox.removeEventListener('loadeddata', this.onLoadedMetaDataEvent)
    clearInterval(this.broadcastInterval)
  }
}
