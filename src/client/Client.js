'use strict'

import { prepareData, uuidv4 } from './utils'

export default class Client {
  /**
   * Constructor
   */
  constructor() {
    this.client = null
    this.id = uuidv4()
  }

  /**
   *
   * @param url
   * @returns {Client}
   */
  start(url) {
    if (!this.client) {
      this.client = new WebSocket(url)
    }

    this.init()
    return this
  }

  addEvent(type, cb) {
    this.client.addEventListener(type, cb)
  }

  /**
   * Initialize base events
   */
  init() {
    // after load
    this.client.onopen = () => {
      const msg = {
        type: 'hello',
        clientID: this.id,
      }
      this.client.send(prepareData(msg))
    }

    //main

    // before unload
    window.addEventListener('beforeunload', () => {
      const msg = {
        type: 'goodbye',
        message: `CLIENT: ${this.id} disconnected`,
        clientID: this.id,
      }
      this.client.send(prepareData(msg))
    })

    // error handler
    this.client.onerror = (error) => {
      console.error('failed to connect', error)
      this.client.close()
    }
  }

  // stop client
  stop() {
    this.client.close()
  }
}
