'use strict'

const { parseData, prepareData, formatDate } = require('./utils')
const WebSocket = require('ws')

class Server {
  /**
   * Constructor
   * @param options
   */
  constructor(options) {
    this.server = null
    this.userList = new Map()
  }

  /**
   * Start server with config
   * @param config
   * @returns {Server}
   */
  start(config) {
    if (!this.server) {
      try {
        this.server = new WebSocket.Server(config, () => {
          console.log(`Server started at port: ${config.port} `)
        })
      } catch (e) {
        console.log(e)
      }
    }

    this.init()

    return this
  }

  /**
   * Broadcast to all clients
   * @param data
   */
  broadcast(data) {
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }

  /**
   * Log data
   * @param data
   */
  logger(data) {
    console.log(`[${formatDate(Date.now())}] Received message: ${data.type}`)
  }

  /**
   * Initialize event on start
   */
  init() {
    this.server.on('connection', (ws) => {
      const hi = {
        type: 'text',
        message: 'SERVER: welcome to Awesome chat',
        canCast: this.server.clients.size === 1,
      }
      ws.send(prepareData(hi))

      ws.on('message', (data) => {
        const receivedData = parseData(data)
        this.logger(receivedData)

        switch (receivedData.type) {
          case 'goodbye': {
            this.userList.delete(receivedData.clientID)

            const response = {
              type: 'text',
              message: `CLIENT: ${receivedData.clientID} leaves chat `,
              id: receivedData.clientID,
            }

            this.broadcast(prepareData(response))
            break
          }
          case 'hello': {
            this.userList.set(receivedData.clientID, ws)

            const response = {
              type: 'text',
              message: `CLIENT: ${receivedData.clientID} now in chat`,
              messageId: receivedData.messageId,
            }

            this.broadcast(prepareData(response))
            break
          }
          case 'casterLeaves': {
            if (this.userList.size > 0) {
              const next = [...this.userList.keys()].slice(-1).pop()
              this.userList.get(next).send(prepareData({ type: 'startCast' }))
            }

            break
          }
          case 'text': {
            const msg = { type: 'ok', messageId: receivedData.messageId }

            this.userList.get(receivedData.owner).send(prepareData(msg))

            this.broadcast(data)
            break
          }
          default: {
            this.broadcast(data)
          }
        }
      })

      ws.on('close', () => {
        console.log('connection is closed')
      })
    })
  }

  /**
   * Stop server
   */
  stop() {
    if (this.server) {
      this.server.close()
      this.server = null
      console.log('API stopped')
    }
  }

  exit() {
    return this.stop()
  }
}

module.exports = Server
