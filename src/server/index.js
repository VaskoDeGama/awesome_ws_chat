const WebSocket= require('ws')

const config = {
  host: 'localhost',
  port: 3000,
  clientTracking: true
}

const wss = new WebSocket.Server(config, () => {
  console.log(`I am alive on port: ${config.port} `)
})

function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data)
    }
  })
}



wss.on('connection', (ws) => {
  console.log('A new connection!')
  ws.send('SERVER: Welcome to the ws chat')

  ws.on('message', (msg) => {
    console.log(`Received message: ${msg}`)
    broadcast(msg)
  })

  ws.on('close', () => {
    console.log('connection is closed')
  })
})

