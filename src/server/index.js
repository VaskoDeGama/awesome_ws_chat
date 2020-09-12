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


wss.on('connection', (ws) => {

  console.log('A new connection!')

  const hi = {
    type: 'text',
    message: 'welcome to Awesome chat',
    canCast: wss.clients.size === 1
  }
  ws.send(prepareData(hi))

  ws.on('message', (data) => {
    const receivedData =  parseData(data)
    console.log(`[${ formatDate(Date.now()) }] Received message: ${receivedData.type}`)
    broadcast(data)
  })

  ws.on('close', () => {
    console.log('connection is closed')
  })
})

