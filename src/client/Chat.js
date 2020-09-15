'use strict'

import { parseData, prepareData, uuidv4, message } from './utils'

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
    this.messeges = {}
    this.chat = document.querySelector(chatSelector)
    this.chatBox = document.querySelector(chatBoxSelector)
    this.inputBox = document.querySelector(inputAreaSelector)
    this.input = document.querySelector(inputSelector)
    this.close = document.querySelectorAll(closeSelector)
  }

  /**
   * @param id
   * @param resolve
   */
  setMsg(id, resolve) {
    this.messeges[id] = resolve
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
          this.chatBox.appendChild(
            message(data.message, data.owner, this.itMyMessage(data.messageId))
          )
          if (this.chatBox.scrollTop < this.chatBox.scrollHeight) {
            this.chatBox.scrollTop = this.chatBox.scrollHeight
          }
          break
        }
      }
    })
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
      this.service.client.send(
        prepareData({
          owner: this.owner,
          messageId,
          ...mail,
        })
      )
    })
  }
}
