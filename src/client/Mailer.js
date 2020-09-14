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
   * 
   * @param id
   * @param resolve
   */
  setMsg(id, resolve) {
    this.messeges[id] = resolve
    console.log('[Add]',id)
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
    this.msg = messageId
    return new Promise((resolve, reject) => {
      this.setMsg(messageId, resolve)
      this.reject = reject
      this.ws.send(prepareData({
        owner: this.owner, messageId, ...mail,
      }))
    })
  }


  /*
  client

  for (let i = 0; i < 10; i++) {
  const res = await Promise.all([
  fetch({cmd: 'test'}),
  fetch({cmd: 'test'})
  fetch({cmd: 'test'}),
  ])
  console.log(res) // r1000, r1002, r3, r4..... r10
  }


  server

  constructor () {
    this.n = 1000
  }

  onMessage(client, msg) {
     const res = this.foo(msg)

     const res2 = {...res, messageId: msg.messageId}

     client.send(res2)
  }

  foo (msg) {
    if (msg.cmd === 'test') {
       return {r: ++this.n }
    } else {
      return {status: false}
    }
  }




  */


}


