const WebSocket= require('ws')
const {parseData, prepareData, formatDate} = require('./utils')


const config = {
  host: 'localhost',
  port: 3000,
  clientTracking: true
}


const wss = new WebSocket.Server(config, () => {
  console.log(`I am alive on port: ${config.port} `)
})


const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}

let whoInChat = []

wss.on('connection', (ws) => {

  console.log('A new connection!')

  const hi = {
    type: 'text',
    message: 'SERVER: welcome to Awesome chat',
    canCast: wss.clients.size === 1
  }
  ws.send(prepareData(hi))

  ws.on('message', (data) => {
    const receivedData =  parseData(data)
    console.log(`[${ formatDate(Date.now()) }] Received message: ${receivedData.type}`)
    switch (receivedData.type) {
      case 'goodbye': {
        whoInChat = whoInChat.filter(client => client.id !== receivedData.clientID)
        const response = {
          type: 'text',
          message: `CLIENT: ${receivedData.clientID} leaves chat `,
        }
        broadcast(prepareData(response))
        break
      }
      case 'hello': {
        whoInChat.push({
          id: receivedData.clientID,
          client: ws
        })
        const response = {
          type: 'text',
          message: `CLIENT: ${receivedData.clientID} now in chat`,
        }
        broadcast(prepareData(response))
        break
      }
      case 'casterLeaves': {
        if (whoInChat.length > 0) {
          const next = Math.floor(Math.random() * Math.floor(whoInChat.length - 1))
          whoInChat[next].client.send(prepareData({type: 'startCast'}))
        }
        break
      }
      default:
        broadcast(data)
    }

  })

  ws.on('close', () => {
    console.log('connection is closed')
  })
})

