'use strict'

import { parseData, message } from './utils'

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
        this.service
          .send({
            type: 'text',
            message: this.input.value,
          })
          .then((res) => {
            if (res) {
              this.input.value = ''
            }
          })
      }
    })

    this.service.addEvent('message', (event) => {
      const data = parseData(event.data)
      switch (data.type) {
        case 'text': {
          this.chatBox.appendChild(
            message(
              data.message,
              data.owner,
              this.service.isMyMessage(data.messageId)
            )
          )
          if (this.chatBox.scrollTop < this.chatBox.scrollHeight) {
            this.chatBox.scrollTop = this.chatBox.scrollHeight
          }
          break
        }
      }
    })
  }
}
