'use strict'

import { parseData, prepareData, uuidv4 } from './utils'

export default class Mailer{

  /**
   * constructor
   */
  constructor (socket, clientId) {
    this.ws = socket
    this.owner = clientId
    this.promise = null
    this.messeges = []
  }

  /**
   * set messages log
   * @param id
   */
  set msg(id) {
    this.messeges.push(id)
  }

  /**
   * get owned id
   * @param id
   * @returns {boolean}
   */
  itMyMessage(id) {
    return this.messeges.includes(id)
  }

  /**
   * fetch
   * @param mail
   */
  fetchWS(mail) {
    const messageId = uuidv4()
    this.msg = messageId
    return new Promise((resolve, reject) => {
      this.reject = reject
      this.resolve = resolve
      this.ws.send(prepareData({
        owner: this.owner, messageId, ...mail,
      }))
    })
  }



}


