'use strict'

import {prepareData, uuidv4 } from './utils'

export default class Mailer{

  /**
   * constructor
   */
  constructor (socket, clientId) {
    this.ws = socket
    this.owner = clientId
    this.messeges = {}
  }

  /**
   * @param id
   * @param resolve
   */
  setMsg(id, resolve) {
    this.messeges[id] = resolve
  }

  /**
   * get owned id
   * @param id
   * @returns {boolean}
   */
  itMyMessage(id) {
    return Object.keys(this.messeges).includes(id)
  }

  /**
   *
   * @param mail
   * @returns {Promise<unknown>}
   */
  fetchWS(mail) {
    const messageId = uuidv4()
    return new Promise((resolve, reject) => {
      this.setMsg(messageId, resolve)
      this.reject = reject
      this.ws.send(prepareData({
        owner: this.owner, messageId, ...mail,
      }))
    })
  }
}


