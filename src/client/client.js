'use strict'

import { parseData, prepareData, uuidv4 } from './utils'

export default class Client {
  /**
   * Constructor
   */
  constructor() {
    this.client = null
    this.id = uuidv4()
    this.canCast = false
    this.messages = new Map()
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

  /**
   * add ws event
   * @param type
   * @param cb
   */
  addEvent(type, cb) {
    this.client.addEventListener(type, cb)
  }

  /**
   * add message id and return Promise
   * @param msg
   * @returns {Promise<unknown>}
   */
  send(msg) {
    return new Promise((resolve) => {
      const messageId = uuidv4()
      this.messages.set(messageId, resolve)
      this.client.send(
        prepareData({
          messageId,
          owner: this.id,
          ...msg,
        })
      )
    })
  }

  /**
   * Check id in messages
   * @param id
   * @returns {boolean}
   */
  isMyMessage(id) {
    return this.messages.has(id)
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
    this.addEvent('message', (event) => {
      const data = parseData(event.data)
      if (data.type === 'text' && data.canCast) {
        this.canCast = true
      }
      if (data.type === 'ok') {
        const localResolve = this.messages.get(data.messageId)
        localResolve({ status: true })
        //this.messages.delete(data.messageId)
      }
    })

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
