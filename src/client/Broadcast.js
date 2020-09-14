'use strict'

export default class Broadcast {
  /**
   * @constructor {Broadcast}
   * @param options
   */
  constructor (options) {
    this.service = options.service
    this.fps = options.fps
    this.webcamSrc = options.webcamSrc
    this.broadcastBox = options.broadcastBox

    this.snapshotCanvas = null
    this.broadcastCanvas = null
    this.snapshotCtx = null
    this.broadcastCtx = null
    this.img = null
    this.broadcastInterval = null
  }

  /**
   *
   * @param target
   * @param styleData
   * @returns target
   */
  static setSize (target, styleData ) {
    target.style.width =  `${styleData.width} px`
    target.style.height = `${styleData.height} px`
    target.width = styleData.width
    target.height = styleData.height
    target.style.left =  `${styleData.left} px`
    target.style.top =  `${styleData.top} px`
    return target
  }

  /**
   * Get base64 string from source throw helper canvas
   * @param source
   * @param snapshotContext
   * @param snapshotCanvas
   * @returns {string}
   */
  static getSnapshot (source, snapshotContext, snapshotCanvas) {
    snapshotContext.drawImage(source, 0, 0)
    return snapshotCanvas.toDataURL('image/jpeg', 0.1).split(',')[1]
  }

  /**
   * Set base64data to target throw img
   * @param img
   * @param data
   * @param targetCtx
   */
  setSnapshot  (data, img = this.img, targetCtx = this.broadcastCtx ) {
    img.onload = () => {
      targetCtx.drawImage(img, 0, 0)
    }
    img.src = `data:image/png;base64,${data}`
  }

  /**
   * Initialize helper elements
   * @returns {Promise<unknown>}
   */
  init () {
    return new Promise((resolve, reject) => {
      try {
        this.snapshotCanvas = document.createElement('canvas')
        this.broadcastCanvas = document.createElement('canvas')
        const vidStyleData = this.webcamSrc.getBoundingClientRect()
        this.broadcastCanvas.id = 'stream'
        this.snapshotCanvas.id = 'screenshot'
        this.broadcastBox.appendChild( Broadcast.setSize(this.snapshotCanvas, vidStyleData))
        this.broadcastBox.appendChild( Broadcast.setSize(this.broadcastCanvas, vidStyleData))
        this.snapshotCtx = this.snapshotCanvas.getContext('2d')
        this.broadcastCtx = this.broadcastCanvas.getContext('2d')
        this.img = new Image()
        resolve()
      } catch (e) {
        reject(e)
      }
    })

  }

  /**
   * Stop broadcasting
   */
  start() {
    this.broadcastInterval = setInterval(() => {
      const snapshot = Broadcast.getSnapshot(this.webcamSrc, this.snapshotCtx, this.snapshotCanvas)
      this.service.send(snapshot)
    }, 1000/ this.fps)
  }

  /**
   * Stop broadcasting
   */
  stop() {
   clearInterval(this.broadcastInterval)
  }




}

