'use strict'
const {formatDate} = require('./utils')

const micro = require('micro')

const API_PORT = 5000

class Server {
  /**
   * @constructor {Server}
   */
  constructor () {
    this.server = null
    this.currentImg = null
  }

  /**
   * Start server
   * @returns {Server}
   */
  start () {
    if (!this.server) {
      this.server = micro(async req => {
        return JSON.stringify(await this.route(await micro.json(req)))
      })

      this.server.listen(API_PORT)
      console.log(`Server started at port ${API_PORT}`)
    }

    return this
  }

  set img(data) {
    this.currentImg = data
  }

  get img() {
    return this.currentImg
  }

  /**
   * @param {object} msg
   * @param {string} msg.type
   * @param {string} msg.data
   * @returns {{status: boolean}}
   */
  route (msg) {
    console.log(`[${formatDate(Date.now())}] Received message:`, msg.type)

    if (typeof msg.type !== 'string') {
      return { status: false } // Bad request
    }

    // TODO
    switch (msg.type) {
      case 'setImg': {
        this.img = msg.data
        return {
          status: true
        }
      }
      case 'getImg': {
        return {
          status: true,
          data: this.img || null
        }
      }
    }
    return { status: false }
  }

  /**
   * Stop server
   */
  stop () {
    if (this.server) {
      this.server.close()
      this.server = null
      console.log('API stopped')
    }
  }

  exit () {
    return this.stop()
  }
}


const service = new Server()

service.start()

process.on('SIGINT', async () => {
  console.log(`Caught interrupt signal. Exit`)
  await service.exit()
  process.exit(0)
})
