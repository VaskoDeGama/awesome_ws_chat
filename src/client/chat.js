'use strict'

import { parseData, prepareData, message } from './utils'

export default class Chat {
  /**
   * constructor
   */
  constructor({
    service,
    inputSelector,
    chatBoxSelector,
    chatSelector,
    closeSelector,
    inputAreaSelector,
  }) {
    this.service = service
    this.owner = this.service.id
    this.chat = document.querySelector(chatSelector)
    this.chatBox = document.querySelector(chatBoxSelector)
    this.inputBox = document.querySelector(inputAreaSelector)
    this.input = document.querySelector(inputSelector)
    this.close = document.querySelectorAll(closeSelector)
  }

  /**
   * Initialize chat boxes
   */
  init() {
    this.close.forEach((node) => {
      node.addEventListener('click', () => {
        this.chat.classList.toggle('hide')
      })
    })
    this.inputBox.addEventListener('submit', async (event) => {
      event.preventDefault()
      if (this.input.value.length !== 0) {
        this.service.client.send(
          prepareData({
            type: 'text',
            message: this.input.value,
            owner: this.service.id,
          })
        )
        this.input.value = ''
      }
    })
    this.service.client.addEventListener('message', (event) => {
      const data = parseData(event.data)
      switch (data.type) {
        case 'text': {
          this.chatBox.appendChild(message(data.message, data.owner, false))
          if (this.chatBox.scrollTop < this.chatBox.scrollHeight) {
            this.chatBox.scrollTop = this.chatBox.scrollHeight
          }
          break
        }
      }
    })
  }

  // fetchWS(mail) {
  //   const messageId = uuidv4()
  //   return new Promise((resolve, reject) => {
  //     this.setMsg(messageId, resolve)
  //     this.reject = reject
  //     this.service.client.send(
  //       prepareData({
  //         owner: this.owner,
  //         messageId,
  //         ...mail,
  //       })
  //     )
  //   })
  // }
}
